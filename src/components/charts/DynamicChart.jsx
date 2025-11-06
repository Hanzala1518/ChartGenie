import ReactECharts from 'echarts-for-react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import {
  getBarChartConfig,
  getLineChartConfig,
  getScatterChartConfig,
  getTreeMapConfig,
  getHeatMapConfig,
  getGanttChartConfig,
  getGeoMapConfig
} from '@/lib/chartConfigs'

/**
 * Dynamic Chart Component
 * Renders different chart types based on chartSpec
 */
export const DynamicChart = forwardRef(({ chartSpec, chartData, className = '' }, ref) => {
  const chartRef = useRef(null)

  // Expose getEchartsInstance to parent
  useImperativeHandle(ref, () => ({
    getEchartsInstance: () => chartRef.current?.getEchartsInstance()
  }))

  if (!chartSpec || !chartData || chartData.length === 0) {
    console.warn('DynamicChart: Missing data', { chartSpec, dataLength: chartData?.length })
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
        <div className="text-center p-4">
          <p className="text-muted-foreground font-medium">No data available</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {!chartSpec && 'Missing chart specification'}
            {chartSpec && (!chartData || chartData.length === 0) && 'No data to display'}
          </p>
        </div>
      </div>
    )
  }

  const getChartOption = () => {
    // Pass full config including custom labels, scales, etc.
    const config = {
      ...chartSpec.config,
      title: chartSpec.title || chartSpec.config.title
    }

    console.log(`📊 Rendering ${chartSpec.chartType} chart with:`, {
      chartType: chartSpec.chartType,
      config,
      dataLength: chartData.length,
      sampleData: chartData.slice(0, 2)
    })

    switch (chartSpec.chartType) {
      case 'bar':
        return getBarChartConfig(chartData, config)
      
      case 'line':
        return getLineChartConfig(chartData, config)
      
      case 'scatter':
        return getScatterChartConfig(chartData, config)
      
      case 'treemap':
        return getTreeMapConfig(chartData, config)
      
      case 'heatmap':
        return getHeatMapConfig(chartData, config)
      
      case 'gantt':
        return getGanttChartConfig(chartData, config)
      
      case 'map':
        return getGeoMapConfig(
          chartData,
          config,
          config.mapType || 'usa'
        )
      
      default:
        console.error('Unknown chart type:', chartSpec.chartType)
        return {
          title: { text: 'Unsupported Chart Type', left: 'center' },
          xAxis: { type: 'category', data: [] },
          yAxis: { type: 'value' },
          series: []
        }
    }
  }

  const option = getChartOption()
  
  // Validate option before rendering
  if (!option || Object.keys(option).length === 0) {
    console.error('DynamicChart: Empty chart option generated', { chartSpec, chartData })
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 dark:bg-red-900/10 rounded-lg border-2 border-dashed border-red-300 dark:border-red-800">
        <div className="text-center p-4">
          <p className="text-red-600 dark:text-red-400 font-medium">Chart rendering error</p>
          <p className="text-xs text-red-500/60 mt-1">Failed to generate chart configuration</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '400px', width: '100%', minHeight: '400px' }}
        opts={{ renderer: 'canvas', locale: 'EN' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  )
})

DynamicChart.displayName = 'DynamicChart'
