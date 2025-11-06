import { useMemo } from 'react'
import { ChartCard } from './ChartCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { generateAutoCharts } from '@/hooks/useGenie'
import { Sparkles } from 'lucide-react'

/**
 * Auto-generated dashboard based on dataset schema
 */
export function AutoDashboard({ dataset, data, loading }) {
  const autoCharts = useMemo(() => {
    // If no data yet, return empty
    if (!data || data.length === 0) {
      console.log('AutoDashboard: No data available')
      return []
    }
    
    // If no schema, infer it from the data
    let schema = dataset?.column_schema
    if (!schema || Object.keys(schema).length === 0) {
      console.log('AutoDashboard: No schema, inferring from data...')
      schema = inferSchema(data)
      console.log('Inferred schema:', schema)
    }
    
    console.log('Generating auto charts with:', {
      schema,
      dataLength: data.length,
      sampleData: data.slice(0, 2),
      schemaKeys: Object.keys(schema),
      schemaJSON: JSON.stringify(schema, null, 2)
    })
    
    const charts = generateAutoCharts(schema, data)
    console.log('Generated charts:', charts)
    console.log('Chart count:', charts.length)
    
    // Debug: manually try to create a simple chart
    if (charts.length === 0) {
      console.log('❌ No charts generated! Debugging...')
      console.log('Schema types:', Object.entries(schema).map(([key, val]) => `${key}: ${val.type}`))
    }
    return charts
  }, [dataset, data])

  // Helper function to infer schema from data
  function inferSchema(data) {
    if (!data || data.length === 0) return {}
    
    const schema = {}
    const sample = data[0]
    
    console.log('🔬 Inferring schema from columns:', Object.keys(sample))
    
    Object.keys(sample).forEach(col => {
      const values = data.slice(0, 100).map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '')
      
      if (values.length === 0) {
        console.log(`  ❌ ${col} → text (no valid values)`)
        schema[col] = { type: 'text' }
        return
      }
      
      // Check if NUMBER first (strict pattern)
      const numPattern = /^-?\d+\.?\d*$/
      const numCount = values.filter(v => {
        const str = String(v).trim()
        return numPattern.test(str) && !isNaN(Number(str)) && str !== ''
      }).length
      
      if (numCount / values.length > 0.8) {
        console.log(`  ✅ ${col} → number (${numCount}/${values.length} numeric)`)
        schema[col] = { type: 'number' }
        return
      }
      
      // Check if DATE (multiple patterns)
      const datePatterns = [
        /^\d{4}-\d{2}-\d{2}/,          // 2024-01-15
        /^\d{1,2}\/\d{1,2}\/\d{2,4}/,  // 1/15/2024
        /^\w{3,9}\s+\d{1,2},?\s+\d{4}/ // January 15, 2024
      ]
      const dateCount = values.filter(v => {
        const str = String(v).trim()
        const matchesPattern = datePatterns.some(p => p.test(str))
        const parseable = !isNaN(Date.parse(str))
        return matchesPattern && parseable
      }).length
      
      if (dateCount / values.length > 0.8) {
        console.log(`  ✅ ${col} → date (${dateCount}/${values.length} parseable dates)`)
        schema[col] = { type: 'date' }
        return
      }
      
      // Check if CATEGORY (low cardinality)
      const uniqueValues = new Set(values)
      if (uniqueValues.size < 20 && uniqueValues.size < values.length * 0.5) {
        console.log(`  ✅ ${col} → category (${uniqueValues.size} unique values)`)
        schema[col] = { type: 'category' }
        return
      }
      
      // Default to TEXT
      console.log(`  ✅ ${col} → text (${uniqueValues.size} unique, fallback)`)
      schema[col] = { type: 'text' }
    })
    
    console.log('📋 Final inferred schema:', Object.entries(schema).map(([k, v]) => `${k}:${v.type}`).join(', '))
    return schema
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold gradient-text">Auto-Generated Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 space-y-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-64 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!autoCharts.length) {
    return (
      <div className="glass-card p-12 text-center">
        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Auto-Charts Available</h3>
        <p className="text-muted-foreground mb-4">
          {!dataset?.column_schema 
            ? 'Dataset is still being analyzed. Please wait...' 
            : !data || data.length === 0
            ? 'No data found in the CSV file.'
            : 'Could not generate charts from this data.'}
        </p>
        {dataset?.status === 'ANALYZING' && (
          <div className="mt-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-4">Analyzing your data...</p>
          </div>
        )}
        {dataset?.status === 'READY' && (
          <p className="text-sm text-muted-foreground">
            Dataset has {Object.keys(dataset.column_schema || {}).length} columns.
            Try asking the Genie to create visualizations for you!
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <h2 className="text-2xl font-bold gradient-text">Auto-Generated Insights</h2>
        <span className="text-sm text-muted-foreground ml-2">
          ({autoCharts.length} {autoCharts.length === 1 ? 'visualization' : 'visualizations'})
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {autoCharts.map((chart, index) => (
          <div key={index} className="space-y-3">
            <ChartCard
              title={chart.title}
              chartSpec={{
                chartType: chart.chartType,
                config: chart.config
              }}
              chartData={chart.aggregatedData || data}
            />
            {chart.insight && (
              <div className="glass-card p-4 border-l-4 border-primary">
                <p className="text-sm text-muted-foreground italic">
                  💡 {chart.insight}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
