import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DynamicChart } from './DynamicChart'
import { Download, Maximize2, X } from 'lucide-react'
import { useState, useRef } from 'react'

/**
 * Card wrapper for charts with title and actions
 */
export function ChartCard({ title, description, chartSpec, chartData, insight }) {
  const [isEnlarged, setIsEnlarged] = useState(false)
  const chartRef = useRef(null)
  const modalChartRef = useRef(null)

  const handleExport = () => {
    // Get the chart instance from the current visible chart
    const ref = isEnlarged ? modalChartRef : chartRef
    if (ref.current) {
      const chartInstance = ref.current.getEchartsInstance()
      if (chartInstance) {
        // Export as PNG
        const url = chartInstance.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff'
        })
        
        // Create download link
        const link = document.createElement('a')
        link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  const handleEnlarge = () => {
    setIsEnlarged(true)
  }

  return (
    <>
      <Card className="glass-card overflow-hidden animate-fade-in hover:shadow-2xl transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-xl gradient-text">{title}</CardTitle>
              {description && (
                <CardDescription>{description}</CardDescription>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExport}
                className="h-8 w-8 hover:bg-primary/20"
                title="Download as PNG"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEnlarge}
                className="h-8 w-8 hover:bg-primary/20"
                title="Enlarge chart"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <DynamicChart
            ref={chartRef}
            chartSpec={chartSpec}
            chartData={chartData}
            className="w-full"
          />
          {insight && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enlarged Modal */}
      {isEnlarged && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setIsEnlarged(false)}
        >
          <div 
            className="relative w-full max-w-7xl h-[90vh] bg-background rounded-lg shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-2xl font-bold gradient-text">{title}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExport}
                  title="Download as PNG"
                >
                  <Download className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEnlarged(false)}
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-hidden">
              <DynamicChart
                ref={modalChartRef}
                chartSpec={chartSpec}
                chartData={chartData}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
