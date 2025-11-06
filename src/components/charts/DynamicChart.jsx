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
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No data available
      </div>
    )
  }

  const getChartOption = () => {
    // Pass full config including custom labels, scales, etc.
    const config = {
      ...chartSpec.config,
      title: chartSpec.title || chartSpec.config.title
    }

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
        return {}
    }
  }

  const option = getChartOption()

  return (
    <div className={className}>
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        notMerge={true}
        lazyUpdate={true}
        theme="dark"
      />
    </div>
  )
})

DynamicChart.displayName = 'DynamicChart'
