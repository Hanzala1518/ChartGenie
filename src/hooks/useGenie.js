import { useMutation } from '@tanstack/react-query'

/**
 * Hook to send queries to the Genie AI
 */
export function useGenie() {
  return useMutation({
    mutationFn: async ({ datasetId, prompt }) => {
      console.log('🧞 Sending Genie query:', { datasetId, prompt })
     
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rag-query`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ datasetId, prompt }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('❌ Genie API Error:', errorData)
        throw new Error(errorData.error || `Genie query failed (${response.status})`)
      }

      const result = await response.json()
      console.log('✅ Genie response:', result)
      return result
    },
  })
}

/**
 * Generate default visualizations based on column schema
 * Updated: 2025-11-05 - Added aggregation hook, fixed logs
 */
export function generateAutoCharts(columnSchema, data) {
  console.log('🔍 generateAutoCharts called with:', { columnSchema, dataLength: data?.length })
 
  if (!data || data.length === 0) {
    console.warn('⚠️ No data provided for auto-charts')
    return []
  }
 
  const charts = []
  const columns = Object.keys(columnSchema) // FIXED: Already array of keys
 
  console.log('📊 Columns found:', columns)

  // Find columns by type
  const numberCols = columns.filter(col => columnSchema[col].type === 'number')
  const dateCols = columns.filter(col => 
    columnSchema[col].type === 'date' || 
    columnSchema[col].type === 'date-start'
  )
  const categoryCols = columns.filter(col => columnSchema[col].type === 'category')
  const geoStateCols = columns.filter(col => columnSchema[col].type === 'geo-state')
  const textCols = columns.filter(col => columnSchema[col].type === 'text')

  console.log('Column types:', { numberCols, dateCols, categoryCols, geoStateCols, textCols })

  // NEW: Helper for aggregation (e.g., for bar/line)
  const aggregateData = (catCol, valCol) => {
    if (!catCol || !valCol) return data
    const agg = {}
    data.forEach(row => {
      const key = row[catCol] || 'Unknown'
      if (!agg[key]) agg[key] = { [catCol]: key, [valCol]: 0 }
      agg[key][valCol] += Number(row[valCol]) || 0
    })
    return Object.values(agg)
  }

  // Priority 1: Bar Chart (aggregated)
  if (categoryCols.length > 0 && numberCols.length > 0 && charts.length === 0) {
    console.log('🎨 Trying bar chart...')
    
    // Find BEST category (good cardinality)
    for (const cat of categoryCols) {
      const unique = [...new Set(data.map(row => row[cat]).filter(v => v != null))] // FIXED: Filter nulls
      console.log(`  ${cat}: ${unique.length} unique values`)
      
      if (unique.length >= 2 && unique.length <= 20) {
        const val = numberCols[0]
        const aggData = aggregateData(cat, val) // NEW: Aggregate
        console.log(`  ✅ Creating: ${val} by ${cat} (aggregated)`)
        
        charts.push({
          chartType: 'bar',
          config: { category: cat, value: val },
          title: `${val} by ${cat}`,
          insight: `Comparing aggregated ${val} across ${cat}`,
          aggregatedData: aggData // NEW: Pass agg for rendering
        })
        break  // Only one bar chart initially
      }
    }
  }

  // Priority 2: Date + Number → Line Chart (time series, aggregated)
  if (dateCols.length > 0 && numberCols.length > 0 && charts.length < 4) {
    const numToCreate = Math.min(numberCols.length, 2, 4 - charts.length)
    for (let i = 0; i < numToCreate; i++) {
      if (charts.length >= 4) break
      
      const aggData = aggregateData(dateCols[0], numberCols[i]) // NEW: Aggregate by date
      charts.push({
        chartType: 'line',
        config: {
          x: dateCols[0],
          y: numberCols[i]
        },
        title: `${numberCols[i]} Trend Over Time`,
        insight: `Tracking aggregated ${numberCols[i]} changes over ${dateCols[0]}`,
        aggregatedData: aggData
      })
    }
  }

  // Priority 3: Number + Number → Scatter Plot (correlation)
  if (numberCols.length >= 2 && charts.length < 4) {
    charts.push({
      chartType: 'scatter',
      config: {
        x: numberCols[0],
        y: numberCols[1]
      },
      title: `${numberCols[0]} vs ${numberCols[1]}`,
      insight: `Exploring relationship between ${numberCols[0]} and ${numberCols[1]}`
    })
  }

  // Priority 4: Geo State + Number → Map (geographic) - DISABLED for now due to missing GeoJSON
  // TODO: Load USA GeoJSON map data before enabling this
  // if (geoStateCols.length > 0 && numberCols.length > 0 && charts.length < 4) {
  //   charts.push({
  //     chartType: 'map',
  //     config: {
  //       region: geoStateCols[0],
  //       value: numberCols[0],
  //       mapType: 'usa'
  //     },
  //     title: `${numberCols[0]} by State`,
  //     insight: `Geographic distribution of ${numberCols[0]} across states`
  //   })
  // }

  // Priority 5: Category + Number → Tree Map (hierarchical visualization)
  if (categoryCols.length > 0 && numberCols.length > 0 && charts.length < 4) {
    // Try to find a category with good cardinality for treemap
    for (let i = 0; i < categoryCols.length && charts.length < 4; i++) {
      const categoryToUse = categoryCols[i]
      const uniqueCategories = [...new Set(data.map(row => row[categoryToUse]).filter(v => v != null))] // FIXED: Filter nulls
      
      // TreeMap works well with 3-50 unique categories
      if (uniqueCategories.length >= 3 && uniqueCategories.length <= 50) {
        // Skip if we already used this category in a bar chart
        const alreadyUsed = charts.some(c => 
          c.chartType === 'bar' && c.config.category === categoryToUse
        )
        
        if (!alreadyUsed) {
          console.log(`✅ Creating treemap: ${numberCols[0]} by ${categoryToUse}`)
          charts.push({
            chartType: 'treemap',
            config: {
              category: categoryToUse,
              value: numberCols[0]
            },
            title: `${numberCols[0]} Distribution by ${categoryToUse}`,
            insight: `Hierarchical view of ${numberCols[0]} across ${categoryToUse}`
          })
          break
        }
      }
    }
  }
  
  // Priority 6: Add more bar charts with different value columns if needed (aggregated)
  if (categoryCols.length > 0 && numberCols.length > 1 && charts.length < 4) {
    for (let i = 1; i < numberCols.length && charts.length < 4; i++) {
      // Find a category that works
      for (let j = 0; j < categoryCols.length && charts.length < 4; j++) {
        const category = categoryCols[j]
        const value = numberCols[i]
        const uniqueCategories = [...new Set(data.map(row => row[category]).filter(v => v != null))] // FIXED: Filter nulls
        
        if (uniqueCategories.length >= 2 && uniqueCategories.length <= 20) {
          // Check if we already have this exact combination
          const alreadyExists = charts.some(c => 
            c.chartType === 'bar' && 
            c.config.category === category && 
            c.config.value === value
          )
          
          if (!alreadyExists) {
            const aggData = aggregateData(category, value) // NEW: Aggregate
            console.log(`✅ Creating additional bar chart: ${value} by ${category} (aggregated)`)
            charts.push({
              chartType: 'bar',
              config: {
                category,
                value
              },
              title: `${value} by ${category}`,
              insight: `Comparing aggregated ${value} across different ${category} values`,
              aggregatedData: aggData
            })
            break
          }
        }
      }
    }
  }
  if (numberCols.length >= 3 && categoryCols.length > 0 && charts.length < 4) {
    const uniqueCategories = [...new Set(data.map(row => row[categoryCols[0]]).filter(v => v != null))] // FIXED: Filter nulls
    
    if (uniqueCategories.length <= 20) {
      charts.push({
        chartType: 'heatmap',
        config: {
          x: categoryCols[0],
          y: numberCols[0],
          value: numberCols[1]
        },
        title: `${numberCols[1]} Heat Map`,
        insight: `Intensity visualization of ${numberCols[1]} across ${categoryCols[0]}`
      })
    }
  }

  // Priority 7: If we have date-start and date-end → Gantt Chart
  const dateStartCols = columns.filter(col => columnSchema[col].type === 'date-start')
  const dateEndCols = columns.filter(col => columnSchema[col].type === 'date-end')
  
  if (dateStartCols.length > 0 && dateEndCols.length > 0 && charts.length < 4) {
    const taskCol = textCols[0] || categoryCols[0] || columns[0]
    charts.push({
      chartType: 'gantt',
      config: {
        task: taskCol,
        start: dateStartCols[0],
        end: dateEndCols[0]
      },
      title: `Project Timeline`,
      insight: `Timeline view of tasks from ${dateStartCols[0]} to ${dateEndCols[0]}`
    })
  }

  // Fallback: If no charts generated yet, create basic visualizations
  if (charts.length === 0) {
    // Just show first number column as bar chart with row index (aggregated if possible)
    if (numberCols.length > 0) {
      const aggData = aggregateData(columns[0], numberCols[0]) // NEW: Try agg
      charts.push({
        chartType: 'bar',
        config: {
          category: columns[0], // First column as category
          value: numberCols[0]
        },
        title: `${numberCols[0]} Overview`,
        insight: `Basic visualization of aggregated ${numberCols[0]} data`,
        aggregatedData: aggData
      })
    }
    
    // If we have 2+ numbers, show scatter
    if (numberCols.length >= 2) {
      charts.push({
        chartType: 'scatter',
        config: {
          x: numberCols[0],
          y: numberCols[1]
        },
        title: `Data Correlation`,
        insight: `Relationship between ${numberCols[0]} and ${numberCols[1]}`
      })
    }
  }

  console.log(`🎯 Generated ${charts.length} charts:`, charts.map(c => ({
    type: c.chartType,
    config: c.config
  })))
  
  if (charts.length === 0) {
    console.error('⚠️ NO CHARTS GENERATED!', { // FIXED: Use Object.entries for log
      numberCols,
      dateCols,
      categoryCols,
      availableColumns: Object.entries(columnSchema).map(([c, s]) => `${c} (${s.type})`)
    })
  }

  // Return top 4 charts (or whatever we generated)
  return charts.slice(0, 4)
}