import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, uploadCSV, downloadCSV } from '@/lib/supabase'
import Papa from 'papaparse'

/**
 * Hook to fetch all datasets for the current user
 */
export function useDatasets() {
  return useQuery({
    queryKey: ['datasets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

/**
 * Hook to fetch a single dataset by ID
 */
export function useDataset(datasetId) {
  return useQuery({
    queryKey: ['dataset', datasetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .eq('id', datasetId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!datasetId,
  })
}

/**
 * Hook to upload and create a new dataset
 */
export function useUploadDataset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, userId }) => {
      // Upload file to storage
      const storagePath = await uploadCSV(file, userId)

      // Create dataset record
      const { data, error } = await supabase
        .from('datasets')
        .insert({
          user_id: userId,
          dataset_name: file.name.replace('.csv', ''),
          storage_object_path: storagePath,
          status: 'PENDING',
        })
        .select()
        .single()

      if (error) throw error

      // Trigger analysis
      await triggerAnalysis(data.id, storagePath)

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] })
    },
  })
}

/**
 * Trigger dataset analysis
 */
async function triggerAnalysis(datasetId, storagePath) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-dataset`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ datasetId, storagePath }),
      }
    )

    if (!response.ok) {
      throw new Error('Analysis failed')
    }
  } catch (error) {
    console.error('Analysis error:', error)
  }
}

/**
 * Hook to delete a dataset
 */
export function useDeleteDataset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (datasetId) => {
      const { error } = await supabase
        .from('datasets')
        .delete()
        .eq('id', datasetId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] })
    },
  })
}

/**
 * Hook to get CSV data from a dataset
 */
export function useDatasetCSV(storagePath) {
  return useQuery({
    queryKey: ['csv-data', storagePath],
    queryFn: async () => {
      const csvText = await downloadCSV(storagePath)
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('CSV parsed:', {
              rowCount: results.data.length,
              columns: results.meta?.fields,
              sample: results.data.slice(0, 2)
            })
            resolve(results.data)
          },
          error: (error) => reject(error),
        })
      })
    },
    enabled: !!storagePath,
  })
}
