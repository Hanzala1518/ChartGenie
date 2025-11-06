import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDatasets, useDeleteDataset } from '@/hooks/useDatasets'
import { DatasetGrid } from '@/components/dashboard/DatasetGrid'
import { UploadModal } from '@/components/dashboard/UploadModal'
import { Button } from '@/components/ui/Button'
import { Plus, LogOut, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Dashboard Page
 */
export function Dashboard() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { data: datasets, isLoading } = useDatasets()
  const deleteMutation = useDeleteDataset()

  const handleDelete = (id) => {
    deleteMutation.mutate(id)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-teal to-coral-pink flex items-center justify-center animate-pulse-glow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">ChartGenie</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="text-muted-foreground">Welcome,</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={signOut}
                className="glass"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Your Datasets</h2>
              <p className="text-muted-foreground">
                Upload CSV files to create beautiful visualizations with AI
              </p>
            </div>
            <Button
              onClick={() => setUploadModalOpen(true)}
              size="lg"
              className="animate-pulse-glow"
            >
              <Plus className="h-5 w-5 mr-2" />
              Upload Dataset
            </Button>
          </div>

          {/* Dataset Grid */}
          <DatasetGrid
            datasets={datasets}
            loading={isLoading}
            onDelete={handleDelete}
          />
        </motion.div>
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  )
}
