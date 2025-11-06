import { DatasetCard } from './DatasetCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Database } from 'lucide-react'

/**
 * Grid of dataset cards
 */
export function DatasetGrid({ datasets, loading, onDelete }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!datasets || datasets.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
          <Database className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2 gradient-text">No Datasets Yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Upload your first CSV file to get started with AI-powered data visualization
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {datasets.map((dataset) => (
        <DatasetCard
          key={dataset.id}
          dataset={dataset}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
