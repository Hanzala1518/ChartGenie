import { useParams, useNavigate } from 'react-router-dom'
import { useDataset, useDatasetCSV } from '@/hooks/useDatasets'
import { AutoDashboard } from '@/components/charts/AutoDashboard'
import { ChatInterface } from '@/components/genie/ChatInterface'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Dataset Detail Page with Charts and Genie Chat
 */
export function DatasetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: dataset, isLoading: datasetLoading } = useDataset(id)
  const { data: csvData, isLoading: csvLoading } = useDatasetCSV(dataset?.storage_object_path)

  if (datasetLoading) {
    return (
      <div className="min-h-screen animated-gradient relative overflow-hidden">
        {/* Decorative elements - Coral Reef theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-coral-teal/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-pink/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[600px]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dataset) {
    return (
      <div className="min-h-screen animated-gradient relative overflow-hidden flex items-center justify-center">
        {/* Decorative elements - Coral Reef theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-coral-teal/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-pink/20 rounded-full blur-3xl" />
        </div>
        
        <div className="text-center relative z-10">
          <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">Dataset not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      {/* Decorative elements - Coral Reef theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-coral-teal/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-pink/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="glass"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-teal to-coral-pink flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">{dataset.dataset_name}</h1>
                  <p className="text-xs text-muted-foreground">
                    {dataset.column_schema && Object.keys(dataset.column_schema).length} columns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <AutoDashboard
              dataset={dataset}
              data={csvData}
              loading={csvLoading}
            />
          </motion.div>

          {/* Genie Chat Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="h-[calc(100vh-8rem)]">
                <ChatInterface datasetId={id} dataset={dataset} />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
