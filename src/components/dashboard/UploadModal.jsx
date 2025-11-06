import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useUploadDataset } from '@/hooks/useDatasets'
import { useAuth } from '@/hooks/useAuth'
import { Upload, FileText, CheckCircle, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Upload Modal Component
 */
export function UploadModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const uploadMutation = useUploadDataset()
  const { user } = useAuth()

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    multiple: false
  })

  const handleUpload = async () => {
    if (!file || !user) return

    setUploading(true)
    try {
      await uploadMutation.mutateAsync({
        file,
        userId: user.id
      })
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setFile(null)
        setSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      setFile(null)
      setSuccess(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg"
        >
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="gradient-text">Upload Dataset</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {success ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Upload Successful!</h3>
                  <p className="text-muted-foreground">Analyzing your dataset...</p>
                </motion.div>
              ) : (
                <>
                  <div
                    {...getRootProps()}
                    className={`
                      border-2 border-dashed rounded-md p-12 text-center cursor-pointer
                      transition-all duration-200
                      ${isDragActive 
                        ? 'border-primary bg-accent/30' 
                        : 'border-muted-foreground/30 hover:border-primary/50'
                      }
                    `}
                  >
                    <input {...getInputProps()} />
                    <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragActive ? 'text-primary animate-bounce' : 'text-muted-foreground'}`} />
                    {isDragActive ? (
                      <p className="text-primary font-medium">Drop your CSV file here</p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-foreground font-medium">
                          Drag & drop a CSV file here
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse
                        </p>
                      </div>
                    )}
                  </div>

                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 glass rounded-lg"
                    >
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFile(null)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      disabled={uploading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={!file || uploading}
                      className="flex-1"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
