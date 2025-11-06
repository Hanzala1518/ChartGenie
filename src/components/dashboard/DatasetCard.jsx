import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate, getStatusColor } from '@/lib/utils'
import { Eye, Trash2, BarChart3, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * Dataset Card Component
 */
export function DatasetCard({ dataset, onDelete }) {
  const navigate = useNavigate()

  const handleView = () => {
    if (dataset.status === 'READY') {
      navigate(`/dataset/${dataset.id}`)
    }
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this dataset?')) {
      onDelete(dataset.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="glass-card h-full hover:shadow-2xl transition-all cursor-pointer" onClick={handleView}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-primary/20">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate gradient-text">
                  {dataset.dataset_name}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(dataset.created_at)}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(dataset.status)}>
              {dataset.status === 'ANALYZING' && (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              )}
              {dataset.status}
            </Badge>
            
            {dataset.column_schema && Object.keys(dataset.column_schema).length > 0 && (
              <span className="text-xs text-muted-foreground">
                {Object.keys(dataset.column_schema).length} columns
              </span>
            )}
          </div>

          {dataset.preview_data && dataset.preview_data.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span>{dataset.preview_data.length} rows</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              disabled={dataset.status !== 'READY'}
              onClick={handleView}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
