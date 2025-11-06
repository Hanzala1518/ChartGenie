import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Papa from 'https://esm.sh/papaparse@5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
const GROQ_MODEL = Deno.env.get('GROQ_MODEL') || 'moonshotai/kimi-k2-instruct-0905'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * Intelligent column type detection
 */
function detectColumnType(columnName: string, values: any[]): string {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '')
  
  if (nonNullValues.length === 0) return 'text'

  const lowerName = columnName.toLowerCase()

  // Check for date-start/date-end patterns
  if (lowerName.includes('start') && lowerName.includes('date')) {
    return 'date-start'
  }
  if (lowerName.includes('end') && lowerName.includes('date')) {
    return 'date-end'
  }

  // Check for numbers FIRST (to avoid pure numbers being detected as dates)
  const numCount = nonNullValues.filter(v => {
    const str = String(v).trim()
    // Must be pure numeric (integers or decimals only)
    return !isNaN(Number(str)) && str !== '' && /^-?\d+\.?\d*$/.test(str)
  }).length
  
  if (numCount / nonNullValues.length > 0.8) {
    return 'number'
  }

  // Check for dates (with strict patterns to avoid matching plain numbers)
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
    /^\d{1,2}\/\d{1,2}\/\d{2,4}/, // M/D/YYYY
    /^\d{2}-\d{2}-\d{4}/, // DD-MM-YYYY
    /^\w{3,9}\s+\d{1,2},?\s+\d{4}/i, // Month DD, YYYY
  ]
  
  const dateCount = nonNullValues.filter(v => {
    const str = String(v).trim()
    // Must match a date pattern AND be parseable as date
    return datePatterns.some(p => p.test(str)) && !isNaN(Date.parse(str))
  }).length

  if (dateCount / nonNullValues.length > 0.8) {
    return 'date'
  }

  // Check for geo-state (US states)
  const usStates = [
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
    'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
    'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan',
    'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire',
    'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio',
    'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
    'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia',
    'wisconsin', 'wyoming', 'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga',
    'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms',
    'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa',
    'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy'
  ]

  const stateCount = nonNullValues.filter(v => {
    const normalized = String(v).toLowerCase().trim()
    return usStates.includes(normalized)
  }).length

  if (stateCount / nonNullValues.length > 0.6) {
    return 'geo-state'
  }

  // Check for categories (low cardinality)
  const uniqueValues = new Set(nonNullValues.map(v => String(v)))
  if (uniqueValues.size < 20 && uniqueValues.size < nonNullValues.length * 0.5) {
    return 'category'
  }

  // Check for lat/lon patterns
  if (lowerName.includes('lat') || lowerName.includes('lon') || lowerName.includes('coordinate')) {
    return 'latlon'
  }

  return 'text'
}

/**
 * Generate smart suggested questions using Groq AI
 */
async function generateSuggestedQuestions(columnSchema: any, sampleData: any[]): Promise<string[]> {
  // Default fallback questions (rule-based)
  const defaultQuestions = generateDefaultQuestions(columnSchema)
  
  if (!GROQ_API_KEY) {
    console.log('⚠️ No Groq API key, using default questions')
    return defaultQuestions
  }

  try {
    const schemaDescription = Object.entries(columnSchema)
      .map(([col, info]: [string, any]) => `- ${col} (${info.type})`)
      .join('\n')

    const sampleRows = sampleData.slice(0, 3).map(row => 
      Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(', ')
    ).join('\n')

    const prompt = `You are a data analyst. Given this dataset schema and sample data, generate 4 insightful visualization questions that users would want to ask.

Dataset Schema:
${schemaDescription}

Sample Data:
${sampleRows}

Generate 4 questions that:
1. Use actual column names from the schema
2. Suggest different chart types (bar, line, scatter, treemap)
3. Are natural language (e.g., "show sales by region", "profit trend over time")
4. Focus on interesting insights

Return ONLY a JSON array of 4 strings. No explanations.
Example: ["show sales by region", "profit trend over time", "compare sales and profit", "market share breakdown"]`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    })

    if (!response.ok) {
      console.error('❌ Groq API error:', response.status)
      return defaultQuestions
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) {
      console.error('❌ No text in Groq response')
      return defaultQuestions
    }

    // Parse JSON from response
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const questions = JSON.parse(cleaned)

    if (Array.isArray(questions) && questions.length > 0) {
      console.log('✅ Generated smart questions:', questions)
      return questions.slice(0, 4)
    }

    return defaultQuestions
  } catch (error) {
    console.error('⚠️ Error generating questions:', error.message)
    return defaultQuestions
  }
}

/**
 * Generate default questions based on column types (fallback)
 */
function generateDefaultQuestions(columnSchema: any): string[] {
  const columns = Object.keys(columnSchema)
  const questions: string[] = []

  const numberCols = columns.filter(col => columnSchema[col].type === 'number')
  const categoryCols = columns.filter(col => columnSchema[col].type === 'category')
  const dateCols = columns.filter(col => columnSchema[col].type === 'date')

  // Bar chart question
  if (categoryCols.length > 0 && numberCols.length > 0) {
    questions.push(`show ${numberCols[0]} by ${categoryCols[0]}`)
  }

  // Line chart question
  if (dateCols.length > 0 && numberCols.length > 0) {
    questions.push(`${numberCols[0]} trend over time`)
  }

  // Scatter question
  if (numberCols.length >= 2) {
    questions.push(`compare ${numberCols[0]} and ${numberCols[1]}`)
  }

  // Treemap question
  if (categoryCols.length > 0 && numberCols.length > 0) {
    questions.push(`${numberCols[0]} breakdown by ${categoryCols[0]}`)
  }

  // Fill with generic questions if needed
  while (questions.length < 4) {
    questions.push('show me an overview of the data')
  }

  return questions.slice(0, 4)
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { datasetId, storagePath } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Update status to ANALYZING
    await supabase
      .from('datasets')
      .update({ status: 'ANALYZING' })
      .eq('id', datasetId)

    // Download CSV from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('datasets')
      .download(storagePath)

    if (downloadError) throw downloadError

    const csvText = await fileData.text()

    // Parse CSV
    const parseResult = await new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
        complete: resolve,
        error: reject,
      })
    })

    const rows = parseResult.data
    const columns = parseResult.meta.fields

    // Detect column types
    const columnSchema = {}
    for (const column of columns) {
      const values = rows.map(row => row[column])
      columnSchema[column] = {
        type: detectColumnType(column, values)
      }
    }

    // Get preview data (first 100 rows)
    const previewData = rows.slice(0, 100)

    // Generate smart suggested questions using Groq
    console.log('🤖 Generating smart suggested questions...')
    const suggestedQuestions = await generateSuggestedQuestions(columnSchema, rows)
    console.log('✅ Suggested questions:', suggestedQuestions)

    // Update dataset with schema, preview, and suggestions
    const { error: updateError } = await supabase
      .from('datasets')
      .update({
        status: 'READY',
        column_schema: columnSchema,
        preview_data: previewData,
        suggested_questions: suggestedQuestions,
      })
      .eq('id', datasetId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, columnSchema }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    
    // Update status to ERROR
    if (datasetId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      await supabase
        .from('datasets')
        .update({ status: 'ERROR' })
        .eq('id', datasetId)
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
