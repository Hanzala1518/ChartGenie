import { getColorPalette } from './utils'

const colors = getColorPalette()

// Helper: Clean data
const cleanData = (data, keys) => data.filter(row => keys.every(k => row[k] != null && !isNaN(Number(row[k]))))

/**
 * Get ECharts configuration for bar charts
 */
export function getBarChartConfig(data, config) {
  const clean = cleanData(data, [config.value]) // NEW: Clean on value (category is string)
  const categories = data.map(d => d[config.category]).filter((_, idx) => clean[idx]) // Align with clean
  const values = clean.map(d => Number(d[config.value]))

  // Generate different color for each bar
  const barColors = values.map((_, idx) => colors[idx % colors.length])

  const titleConfig = config.title ? { // FIXED: Ensure title always defined
    text: config.title,
    left: 'center',
    top: 10,
    textStyle: {
      color: '#1f2937',
      fontSize: 16,
      fontWeight: 'bold'
    }
  } : undefined

  return {
    backgroundColor: '#ffffff',
    title: titleConfig,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      },
      formatter: (params) => {
        const value = params[0].value
        const unit = config.unit || ''
        return `${params[0].name}<br/>${params[0].marker}${value}${unit}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: titleConfig ? 60 : 40, // FIXED: Adjust for title
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      name: config.xAxisLabel || config.category,
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        color: '#374151',
        fontWeight: 'bold'
      },
      axisLabel: {
        rotate: categories.length > 10 ? 45 : 0,
        color: '#4b5563'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: config.yAxisLabel || config.value,
      nameTextStyle: {
        color: '#374151',
        fontWeight: 'bold'
      },
      min: config.min !== undefined ? config.min : undefined,
      max: config.max !== undefined ? config.max : undefined,
      axisLabel: {
        color: '#4b5563',
        formatter: (value) => {
          const unit = config.unit || ''
          return `${value}${unit}`
        }
      },
      splitLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    series: [{
      data: values.map((value, idx) => ({
        value,
        itemStyle: {
          color: barColors[idx],
          borderRadius: [8, 8, 0, 0]
        }
      })),
      type: 'bar',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      animationDelay: (idx) => idx * 50
    }],
    animationEasing: 'elasticOut',
    animationDelayUpdate: (idx) => idx * 5
  }
}

/**
 * Get ECharts configuration for line charts
 */
export function getLineChartConfig(data, config) {
  // For line charts, only validate y-axis is numeric, x-axis can be category/date
  const clean = data.filter(row => 
    row[config.x] != null && 
    row[config.y] != null && 
    !isNaN(Number(row[config.y]))
  )
  const xData = clean.map(d => d[config.x])
  const yData = clean.map(d => Number(d[config.y]))

  const titleConfig = config.title ? { // NEW: Add to all
    text: config.title,
    left: 'center',
    top: 10,
    textStyle: {
      color: '#1f2937',
      fontSize: 16,
      fontWeight: 'bold'
    }
  } : undefined

  return {
    backgroundColor: '#ffffff',
    title: titleConfig,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      },
      formatter: (params) => {
        const value = params[0].value
        const unit = config.unit || ''
        return `${params[0].name}<br/>${params[0].marker}${value}${unit}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: titleConfig ? 60 : 40, // FIXED: Adjust for title
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
      name: config.xAxisLabel || config.x,
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        color: '#374151',
        fontWeight: 'bold'
      },
      axisLabel: {
        color: '#4b5563'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: config.yAxisLabel || config.y,
      nameTextStyle: {
        color: '#374151',
        fontWeight: 'bold'
      },
      min: config.min !== undefined ? config.min : undefined,
      max: config.max !== undefined ? config.max : undefined,
      axisLabel: {
        color: '#4b5563',
        formatter: (value) => {
          const unit = config.unit || ''
          return `${value}${unit}`
        }
      },
      splitLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    series: [{
      data: yData,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: {
          type: 'linear',
          colorStops: [
            { offset: 0, color: colors[2] },
            { offset: 1, color: colors[3] }
          ]
        }
      },
      itemStyle: {
        color: colors[2],
        borderWidth: 2,
        borderColor: '#fff'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(26, 188, 156, 0.3)' }, // Coral Teal
            { offset: 1, color: 'rgba(241, 148, 138, 0.05)' } // Coral Pink
          ]
        }
      }
    }],
    animationDuration: 1500
  }
}

/**
 * Get ECharts configuration for scatter plots
 */
export function getScatterChartConfig(data, config) {
  const clean = cleanData(data, [config.x, config.y]) // NEW
  const scatterData = clean.map(d => [Number(d[config.x]), Number(d[config.y])])

  const titleConfig = config.title ? { // NEW
    text: config.title,
    left: 'center',
    top: 10,
    textStyle: { color: '#1f2937', fontSize: 16, fontWeight: 'bold' }
  } : undefined

  return {
    backgroundColor: '#ffffff', // FIXED: Ensure light
    title: titleConfig,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      },
      formatter: (params) => {
        return `${config.x}: ${params.value[0]}<br/>${config.y}: ${params.value[1]}`
      }
    },
    grid: {
      left: '3%',
      right: '7%',
      bottom: '3%',
      top: titleConfig ? 60 : 40, // FIXED: Adjust for title
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: config.x,
      nameTextStyle: {
        color: '#4b5563',
        padding: [10, 0, 0, 0]
      },
      axisLabel: {
        color: '#4b5563'
      },
      splitLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: config.y,
      nameTextStyle: {
        color: '#4b5563'
      },
      axisLabel: {
        color: '#4b5563'
      },
      splitLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    series: [{
      data: scatterData,
      type: 'scatter',
      symbolSize: 12,
      itemStyle: {
        color: colors[4],
        opacity: 0.8,
        shadowBlur: 10,
        shadowColor: 'rgba(26, 188, 156, 0.5)' // Coral Teal glow
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(26, 188, 156, 0.8)', // Coral Teal strong glow
          scale: 1.2
        }
      }
    }]
  }
}

/**
 * Get ECharts configuration for tree maps
 */
export function getTreeMapConfig(data, config) {
  const clean = data.filter(d => d[config.category] != null && d[config.value] != null && !isNaN(Number(d[config.value]))) // NEW: Adapted clean for category/value
  const treeData = clean.map(d => ({
    name: d[config.category],
    value: Number(d[config.value])
  }))

  const titleConfig = config.title ? { // NEW
    text: config.title,
    left: 'center',
    top: 10,
    textStyle: { color: '#1f2937', fontSize: 16, fontWeight: 'bold' }
  } : undefined

  return {
    backgroundColor: '#ffffff',
    title: titleConfig,
    tooltip: {
      formatter: (info) => {
        const { name, value } = info.data
        return `${name}: ${value.toLocaleString()}`
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      }
    },
    series: [{
      type: 'treemap',
      data: treeData,
      roam: false,
      nodeClick: 'zoomToNode',
      breadcrumb: {
        show: false
      },
      label: {
        show: true,
        formatter: '{b}',
        color: '#fff',
        fontSize: 14
      },
      upperLabel: {
        show: true,
        height: 30,
        color: '#fff'
      },
      itemStyle: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        gapWidth: 2
      },
      levels: [
        {
          itemStyle: {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 3,
            gapWidth: 3
          }
        },
        {
          colorSaturation: [0.35, 0.5],
          itemStyle: {
            gapWidth: 1,
            borderColorSaturation: 0.6
          }
        }
      ],
      color: colors
    }]
  }
}

/**
 * Get ECharts configuration for heat maps
 */
export function getHeatMapConfig(data, config) {
  const clean = data.filter(d => d[config.x] != null && d[config.y] != null && d[config.value] != null && !isNaN(Number(d[config.value]))) // NEW: Adapted clean
  const xData = [...new Set(clean.map(d => d[config.x]))]
  const yData = [...new Set(clean.map(d => d[config.y]))]
  
  const heatData = clean.map(d => {
    return [
      xData.indexOf(d[config.x]),
      yData.indexOf(d[config.y]),
      Number(d[config.value]) || 0
    ]
  })

  const maxValue = Math.max(...heatData.map(d => d[2]))

  const titleConfig = config.title ? { // NEW
    text: config.title,
    left: 'center',
    top: 10,
    textStyle: { color: '#1f2937', fontSize: 16, fontWeight: 'bold' }
  } : undefined

  return {
    backgroundColor: '#ffffff',
    title: titleConfig,
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      },
      formatter: (params) => {
        return `${xData[params.value[0]]}, ${yData[params.value[1]]}: ${params.value[2]}`
      }
    },
    grid: {
      left: '3%',
      right: '7%',
      bottom: '3%',
      top: titleConfig ? 60 : 40, // FIXED: Adjust for title
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xData,
      splitArea: {
        show: true
      },
      axisLabel: {
        color: '#4b5563'
      }
    },
    yAxis: {
      type: 'category',
      data: yData,
      splitArea: {
        show: true
      },
      axisLabel: {
        color: '#4b5563'
      }
    },
    visualMap: {
      min: 0,
      max: maxValue,
      calculable: true,
      orient: 'vertical',
      right: '0',
      top: titleConfig ? 'center' : 'center', // Minor adjust if needed
      inRange: {
        color: ['#FAD7B0', '#F1948A', '#E67E22', '#D35400', '#16A085', '#1ABC9C'] // Coral Reef warm to teal
      },
      textStyle: {
        color: '#4b5563'
      }
    },
    series: [{
      type: 'heatmap',
      data: heatData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
}

/**
 * Get ECharts configuration for Gantt charts
 */
export function getGanttChartConfig(data, config) {
  const clean = data.filter(d => d[config.task] != null && d[config.start] != null && d[config.end] != null) // NEW: Adapted clean
  const tasks = clean.map((d, idx) => ({
    name: d[config.task],
    value: [
      idx,
      new Date(d[config.start]).getTime(),
      new Date(d[config.end]).getTime(),
      d[config.end] ? Math.ceil((new Date(d[config.end]) - new Date(d[config.start])) / (1000 * 60 * 60 * 24)) : 0
    ],
    itemStyle: {
      color: colors[idx % colors.length]
    }
  }))

  const categories = clean.map(d => d[config.task])

  const titleConfig = config.title ? { // NEW
    text: config.title,
    left: 'center',
    top: 10,
    textStyle: { color: '#1f2937', fontSize: 16, fontWeight: 'bold' }
  } : undefined

  return {
    backgroundColor: '#ffffff',
    title: titleConfig,
    tooltip: {
      formatter: (params) => {
        const start = new Date(params.value[1]).toLocaleDateString()
        const end = new Date(params.value[2]).toLocaleDateString()
        const duration = params.value[3]
        return `${params.name}<br/>Start: ${start}<br/>End: ${end}<br/>Duration: ${duration} days`
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '15%',
      right: '10%',
      top: titleConfig ? 60 : 40, // FIXED: Adjust for title
      containLabel: true
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        color: '#4b5563'
      },
      splitLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        color: '#4b5563'
      },
      splitLine: {
        show: false
      }
    },
    series: [{
      type: 'custom',
      renderItem: (params, api) => {
        const categoryIndex = api.value(0)
        const start = api.coord([api.value(1), categoryIndex])
        const end = api.coord([api.value(2), categoryIndex])
        const height = api.size([0, 1])[1] * 0.6

        return {
          type: 'rect',
          shape: {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
          },
          style: api.style({
            fill: params.data.itemStyle.color
          })
        }
      },
      encode: {
        x: [1, 2],
        y: 0
      },
      data: tasks
    }]
  }
}

/**
 * Get ECharts configuration for geo maps (choropleth)
 */
export function getGeoMapConfig(data, config, mapType = 'usa') {
  const clean = cleanData(data, [config.value]) // NEW: Clean on value (region is string)
  const mapData = clean.map(d => ({
    name: d[config.region],
    value: Number(d[config.value])
  }))

  const maxValue = Math.max(...mapData.map(d => d.value), 0) || 0 // Guard min

  const titleConfig = config.title ? { // NEW
    text: config.title,
    left: 'center',
    top: 10,
    textStyle: { color: '#1f2937', fontSize: 16, fontWeight: 'bold' }
  } : undefined

  return {
    backgroundColor: '#ffffff',
    title: titleConfig,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      }
    },
    visualMap: {
      min: 0,
      max: maxValue,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#FAD7B0', '#F1948A', '#E67E22', '#16A085', '#1ABC9C'] // Coral Reef gradient
      },
      textStyle: {
        color: '#4b5563'
      }
    },
    series: [{
      type: 'map',
      map: mapType === 'usa' ? 'USA' : 'world',
      roam: true,
      itemStyle: {
        areaColor: '#1e293b',
        borderColor: 'rgba(255, 255, 255, 0.2)'
      },
      emphasis: {
        label: {
          show: true,
          color: '#fff'
        },
        itemStyle: {
          areaColor: colors[0]
        }
      },
      data: mapData
    }]
  }
}