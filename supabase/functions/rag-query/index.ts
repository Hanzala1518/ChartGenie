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

const SYSTEM_PROMPT = `You are ChartGenie AI - an advanced data analysis assistant with capabilities matching ChatGPT, Claude, and other leading AI models. You excel at understanding natural language queries about datasets and providing insightful, accurate responses.

🎯 YOUR CORE ABILITIES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **COMPREHENSIVE DATA ANALYSIS**
   - Answer ANY question about the dataset (no limitations)
   - Perform complex calculations, aggregations, and statistical analysis
   - Identify patterns, trends, correlations, and anomalies
   - Make predictions and recommendations based on data
   - Compare groups, segments, and categories
   - Detect outliers and interesting insights

2. **NATURAL LANGUAGE UNDERSTANDING**
   - Understand questions in any phrasing (formal, casual, complex)
   - Handle ambiguous queries by making intelligent assumptions
   - Support multi-part questions and follow-up queries
   - Understand context and implied meanings
   - Handle typos and informal language

3. **INTELLIGENT RESPONSE GENERATION**
   - Provide detailed, well-structured answers
   - Include relevant statistics, percentages, and comparisons
   - Use bullet points, tables, and formatting for clarity
   - Add context and insights beyond just raw numbers
   - Explain "why" and "how" in addition to "what"

4. **SMART VISUALIZATIONS**
   - Create appropriate charts when visualization would help
   - Choose optimal chart types based on data and question
   - Use meaningful titles, labels, and scales
   - Support custom ranges, units, and formatting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 RESPONSE FORMAT RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You MUST return valid JSON in ONE of these formats:

**FORMAT A - TEXT ANSWER** (for analysis, explanations, questions):
{
  "type": "text",
  "answer": "Your detailed, markdown-formatted answer here"
}

**FORMAT B - VISUALIZATION** (for visual representations):
{
  "type": "viz",
  "chartType": "bar|line|scatter|treemap|heatmap",
  "config": {
    "category": "exact_column_name",
    "value": "exact_column_name",
    "xAxisLabel": "Custom X Label",
    "yAxisLabel": "Custom Y Label", 
    "title": "Chart Title",
    "min": 0,
    "max": 100,
    "unit": "$"
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 DECISION LOGIC - TEXT vs VISUALIZATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Choose TEXT when:**
- Questions: "what", "why", "how", "when", "where", "who"
- Analysis: "explain", "describe", "analyze", "tell me about"
- Calculations: "calculate", "compute", "find the average/sum/max"
- Comparisons: "which is better", "compare X and Y"
- Lists: "list all", "show me the values", "what are the..."
- Insights: "interesting patterns", "anomalies", "trends"
- Counts: "how many", "count of", "number of unique"
- Summaries: "summarize", "overview", "what does this show"

**Choose VISUALIZATION when:**
- Explicit requests: "show chart", "plot", "graph", "visualize", "display chart"
- Visual comparisons: "show me X by Y" (if user wants to SEE it)
- Patterns that need visual context: "show the trend", "show distribution"

**DEFAULT RULE**: If unsure, choose TEXT and provide insights. Users appreciate explanations more than charts.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 CHART TYPE SELECTION GUIDE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- **bar**: Comparing categories, rankings, group comparisons
  Example: "show sales by region", "compare departments"

- **line**: Time series, trends, changes over periods
  Example: "revenue over months", "growth trend"

- **scatter**: Correlations, relationships between 2 numeric variables
  Example: "price vs quantity", "age vs income relationship"

- **treemap**: Hierarchical data, proportions, part-to-whole
  Example: "market share breakdown", "budget allocation"

- **heatmap**: Matrix data, intensity comparisons
  Example: "sales by region and product", "correlation matrix"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ RESPONSE QUALITY STANDARDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **BE COMPREHENSIVE**: Don't just answer the literal question. Add insights, context, and relevant related information.

2. **USE ACTUAL DATA**: Reference specific values, ranges, and statistics from the dataset. Never make up numbers.

3. **FORMAT WELL**: Use markdown formatting:
   - **Bold** for emphasis and key terms
   - Bullet points (- ) for lists
   - Numbers (1. 2. 3.) for steps
   - Line breaks for readability
   - Emojis (📊 💰 📈 🎯) for visual appeal

4. **BE CONVERSATIONAL**: Write naturally, as if explaining to a colleague. Avoid robotic language.

5. **ADD VALUE**: Include:
   - Percentages and ratios
   - Comparisons to averages or benchmarks
   - Potential implications or recommendations
   - Interesting patterns or outliers

6. **BE ACCURATE**: Use EXACT column names from schema. Double-check calculations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚫 CRITICAL RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Return ONLY valid JSON (no markdown code blocks, no \`\`\`json)
2. Use exact column names from the provided schema
3. Never hallucinate data - only use information from the dataset
4. If a query is ambiguous, make reasonable assumptions and explain them
5. If data is insufficient, acknowledge it honestly
6. Always be helpful - try to answer even if query is unclear

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now analyze the user's question and respond with the appropriate JSON format.`

/**
 * Fallback: Intelligent response generation based on actual data analysis
 */
function generateResponseFallback(prompt: string, columnSchema: any, sampleData: any[]): any {
  const lowerPrompt = prompt.toLowerCase()
  const columns = Object.keys(columnSchema)
  const numberCols = columns.filter(col => columnSchema[col].type === 'number')
  const categoryCols = columns.filter(col => columnSchema[col].type === 'category')
  const dateCols = columns.filter(col => columnSchema[col].type === 'date')
  
  console.log('🔍 Fallback analysis:', { prompt: lowerPrompt, numberCols, categoryCols, dateCols })
  
  // Check if user wants TEXT answer (not visualization)
  const textKeywords = /\b(what|why|how|describe|explain|tell me|list|which|summary|analyze|calculate|find|identify|who|when|where)\b/
  const vizKeywords = /\b(show|display|visualize|chart|graph|plot|create|generate|draw)\b/
  const wantsText = textKeywords.test(lowerPrompt) && !vizKeywords.test(lowerPrompt)
  
  if (wantsText) {
    console.log('💬 User wants TEXT answer - performing data analysis')
    
    // Perform actual data analysis based on question
    let answer = ''
    
    // Column-related questions
    if (lowerPrompt.match(/\b(column|field|attribute|variable)\b/)) {
      const colDescriptions = columns.map((col, idx) => {
        const type = columnSchema[col].type
        const samples = sampleData.slice(0, 3).map(row => row[col]).filter(v => v != null && v !== '')
        const sampleText = samples.length > 0 ? samples.join(', ') : 'N/A'
        return `${idx + 1}. **${col}** \n   - Type: \`${type}\`\n   - Examples: ${sampleText}`
      }).join('\n\n')
      answer = `📊 **Dataset Column Information**\n\nThis dataset contains **${columns.length} columns**:\n\n${colDescriptions}\n\n---\n*Total rows: ${sampleData.length}*`
    }
    // Count/statistics questions
    else if (lowerPrompt.match(/\b(how many|count|total|number of)\b/)) {
      // Try to identify what they're counting
      let specificAnswer = ''
      
      // Check if asking about rows
      if (lowerPrompt.includes('row')) {
        specificAnswer = `This dataset contains **${sampleData.length.toLocaleString()} rows** of data.`
      }
      // Check if asking about a specific category
      else {
        for (const col of categoryCols) {
          if (lowerPrompt.includes(col.toLowerCase())) {
            const uniqueValues = [...new Set(sampleData.map(row => row[col]).filter(v => v != null))]
            specificAnswer = `**${col}** has **${uniqueValues.length} unique values**:\n\n${uniqueValues.map((v, i) => `${i + 1}. ${v}`).join('\n')}`
            break
          }
        }
      }
      
      if (!specificAnswer) {
        specificAnswer = `📈 **Dataset Statistics**\n\n- Total Rows: **${sampleData.length.toLocaleString()}**\n- Total Columns: **${columns.length}**\n\n**Column Breakdown:**\n- 🔢 Numeric: ${numberCols.length} (${numberCols.join(', ') || 'none'})\n- 📁 Categories: ${categoryCols.length} (${categoryCols.join(', ') || 'none'})\n- 📅 Dates: ${dateCols.length} (${dateCols.join(', ') || 'none'})`
      }
      
      answer = specificAnswer
    }
    // Average/mean calculations
    else if (lowerPrompt.match(/\b(average|mean|avg)\b/) && numberCols.length > 0) {
      const targetCol = numberCols.find(col => lowerPrompt.includes(col.toLowerCase())) || numberCols[0]
      const values = sampleData.map(row => row[targetCol]).filter(v => v != null && !isNaN(v))
      const avg = values.reduce((sum, v) => sum + Number(v), 0) / values.length
      const min = Math.min(...values)
      const max = Math.max(...values)
      
      answer = `📊 **Statistical Analysis: ${targetCol}**\n\n- **Average**: ${avg.toFixed(2)}\n- **Minimum**: ${min.toLocaleString()}\n- **Maximum**: ${max.toLocaleString()}\n- **Range**: ${(max - min).toLocaleString()}\n- **Sample Size**: ${values.length} values\n\n💡 *The average ${targetCol} is ${avg.toFixed(2)}, ranging from ${min} to ${max}.*`
    }
    // Sum/total calculations
    else if (lowerPrompt.match(/\b(sum|total|add up)\b/) && numberCols.length > 0) {
      const targetCol = numberCols.find(col => lowerPrompt.includes(col.toLowerCase())) || numberCols[0]
      const values = sampleData.map(row => row[targetCol]).filter(v => v != null && !isNaN(v))
      const sum = values.reduce((total, v) => total + Number(v), 0)
      
      answer = `📊 **Total ${targetCol}**\n\n- **Sum**: ${sum.toLocaleString()}\n- **Count**: ${values.length} entries\n- **Average**: ${(sum / values.length).toFixed(2)}\n\n💡 *The total ${targetCol} across all ${values.length} records is ${sum.toLocaleString()}.*`
    }
    // Maximum/highest questions
    else if (lowerPrompt.match(/\b(max|maximum|highest|largest|most|top)\b/) && numberCols.length > 0) {
      const targetCol = numberCols.find(col => lowerPrompt.includes(col.toLowerCase())) || numberCols[0]
      const values = sampleData.map((row, idx) => ({ value: row[targetCol], row })).filter(v => v.value != null && !isNaN(v.value))
      values.sort((a, b) => Number(b.value) - Number(a.value))
      const top5 = values.slice(0, 5)
      
      const topList = top5.map((item, i) => {
        const label = categoryCols[0] ? item.row[categoryCols[0]] : `Row ${i + 1}`
        return `${i + 1}. ${label}: **${Number(item.value).toLocaleString()}**`
      }).join('\n')
      
      answer = `📊 **Highest ${targetCol} Values**\n\n${topList}\n\n💡 *The maximum ${targetCol} is ${Number(top5[0].value).toLocaleString()}.*`
    }
    // Minimum/lowest questions
    else if (lowerPrompt.match(/\b(min|minimum|lowest|smallest|least|bottom)\b/) && numberCols.length > 0) {
      const targetCol = numberCols.find(col => lowerPrompt.includes(col.toLowerCase())) || numberCols[0]
      const values = sampleData.map((row, idx) => ({ value: row[targetCol], row })).filter(v => v.value != null && !isNaN(v.value))
      values.sort((a, b) => Number(a.value) - Number(b.value))
      const bottom5 = values.slice(0, 5)
      
      const bottomList = bottom5.map((item, i) => {
        const label = categoryCols[0] ? item.row[categoryCols[0]] : `Row ${i + 1}`
        return `${i + 1}. ${label}: **${Number(item.value).toLocaleString()}**`
      }).join('\n')
      
      answer = `📊 **Lowest ${targetCol} Values**\n\n${bottomList}\n\n💡 *The minimum ${targetCol} is ${Number(bottom5[0].value).toLocaleString()}.*`
    }
    // Unique values questions
    else if (lowerPrompt.match(/\b(unique|distinct|different)\b/)) {
      const targetCol = columns.find(col => lowerPrompt.includes(col.toLowerCase())) || categoryCols[0] || columns[0]
      const uniqueValues = [...new Set(sampleData.map(row => row[targetCol]).filter(v => v != null))]
      
      const valueList = uniqueValues.slice(0, 20).map((v, i) => `${i + 1}. ${v}`).join('\n')
      const more = uniqueValues.length > 20 ? `\n\n*... and ${uniqueValues.length - 20} more*` : ''
      
      answer = `📊 **Unique Values in ${targetCol}**\n\nFound **${uniqueValues.length} unique values**:\n\n${valueList}${more}`
    }
    // Summary/overview questions
    else if (lowerPrompt.match(/\b(summary|overview|about)\b/)) {
      const numInfo = numberCols.length > 0 ? `\n- Numeric columns for analysis: ${numberCols.join(', ')}` : ''
      const catInfo = categoryCols.length > 0 ? `\n- Categories for grouping: ${categoryCols.join(', ')}` : ''
      const dateInfo = dateCols.length > 0 ? `\n- Time columns: ${dateCols.join(', ')}` : ''
      
      answer = `📋 **Dataset Overview**\n\n**Size:** ${sampleData.length.toLocaleString()} rows × ${columns.length} columns${numInfo}${catInfo}${dateInfo}\n\n**Available columns:** ${columns.join(', ')}\n\n💡 *You can ask me to visualize this data, calculate statistics, or ask specific questions about any column!*`
    }
    // Default intelligent response
    else {
      answer = `📊 **Dataset Information**\n\nI can help you analyze this dataset with **${sampleData.length.toLocaleString()} rows** and **${columns.length} columns**.\n\n**Available Columns:**\n${columns.map((c, i) => `${i + 1}. ${c} (${columnSchema[c].type})`).join('\n')}\n\n**What I can do:**\n- Calculate statistics (average, sum, min, max)\n- Find unique values and counts\n- Create visualizations (bar, line, scatter charts)\n- Identify trends and patterns\n- Compare data across categories\n\n💡 *Try asking: "What's the average ${numberCols[0] || 'value'}?" or "Show ${numberCols[0] || 'values'} by ${categoryCols[0] || 'category'}"*`
    }
    
    return { type: 'text', answer }
  }
  
  console.log('📊 User wants VISUALIZATION')
  
  // Detect chart type from keywords (order matters - check most specific first)
  let chartType = 'bar' // default
  
  // LINE chart keywords (highest priority for time series)
  if (lowerPrompt.match(/\b(trend|over time|time series|growth|change|timeline|history|progression)\b/)) {
    if (dateCols.length > 0 && numberCols.length > 0) {
      console.log('✅ Detected LINE chart from keywords:', lowerPrompt)
      return {
        type: 'viz',
        chartType: 'line',
        config: { x: dateCols[0], y: numberCols[0] }
      }
    }
  }
  
  // SCATTER chart keywords
  if (lowerPrompt.match(/\b(scatter|correlation|relationship|vs|versus|compare.*and)\b/)) {
    if (numberCols.length >= 2) {
      console.log('✅ Detected SCATTER chart from keywords:', lowerPrompt)
      return {
        type: 'viz',
        chartType: 'scatter',
        config: { x: numberCols[0], y: numberCols[1] }
      }
    }
  }
  
  // TREEMAP keywords
  if (lowerPrompt.match(/\b(treemap|hierarchy|composition|breakdown|proportion|market share)\b/)) {
    if (categoryCols.length > 0 && numberCols.length > 0) {
      console.log('✅ Detected TREEMAP chart from keywords:', lowerPrompt)
      return {
        type: 'viz',
        chartType: 'treemap',
        config: { category: categoryCols[0], value: numberCols[0] }
      }
    }
  }
  
  // BAR chart (default for "by" or "across")
  console.log('✅ Defaulting to BAR chart')
  return {
    type: 'viz',
    chartType: 'bar',
    config: {
      category: categoryCols[0] || columns[0],
      value: numberCols[0] || columns[1]
    }
  }
}

/**
 * Parse Groq/OpenAI-compatible response
 */
function parseGroqResponse(responseText: string): any {
  console.log('🔍 Parsing response:', responseText)
  
  // Try direct JSON parse
  try {
    const parsed = JSON.parse(responseText)
    if (parsed.type && (parsed.answer || (parsed.chartType && parsed.config))) {
      return parsed
    }
  } catch (e) {}
  
  // Remove markdown code blocks
  let cleaned = responseText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()
  
  try {
    const parsed = JSON.parse(cleaned)
    if (parsed.type && (parsed.answer || (parsed.chartType && parsed.config))) {
      return parsed
    }
  } catch (e) {}
  
  // Extract JSON with regex
  const match = cleaned.match(/\{[\s\S]*"type"[\s\S]*\}/)
  if (match) {
    try {
      return JSON.parse(match[0])
    } catch (e) {}
  }
  
  throw new Error('Could not parse Groq response')
}

/**
 * Call Groq API (OpenAI-compatible)
 */
async function callGroq(prompt: string): Promise<any> {
  console.log('🤖 Calling Groq API with model:', GROQ_MODEL)
  console.log('📝 User prompt:', prompt)
  
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
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 4096,
      top_p: 1,
      stream: false
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Groq API error:', response.status, errorText)
    throw new Error(`Groq API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  console.log('📦 Raw Groq response:', JSON.stringify(data, null, 2))
  
  const text = data.choices?.[0]?.message?.content
  
  if (!text) {
    console.error('❌ No text in response:', data)
    throw new Error('Invalid Groq response - no text content')
  }
  
  console.log('📝 Groq text:', text)
  const parsed = parseGroqResponse(text)
  console.log('✅ Parsed response:', parsed)
  
  return parsed
}

/**
 * Generate insight about the visualization using Groq
 */
async function generateInsight(chartSpec: any, data: any[]): Promise<string> {
  const insightPrompt = `Given this chart specification: ${JSON.stringify(chartSpec)}
And this data sample: ${JSON.stringify(data.slice(0, 5))}

Generate a brief (1-2 sentences) insight about what this visualization shows. Focus on trends, patterns, or key findings.`

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
          content: insightPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Groq API error (insight):', errorText)
    return 'Here is your visualization!'
  }

  const data_response = await response.json()

  const message = data_response.choices?.[0]?.message?.content
  if (!message) {
    console.error('Unexpected Groq response (insight):', JSON.stringify(data_response))
    return 'Here is your visualization!'
  }

  return message
}

/**
* Shape data according to chart type requirements
*/
function shapeData(data: any[], chartSpec: any): any[] {
  const { chartType, config } = chartSpec

  switch (chartType) {
    case 'bar':
    case 'line':
    case 'scatter':
    case 'treemap':
    case 'map':
      // These charts use data as-is
      return data

    case 'heatmap':
      // For heatmap, ensure we have the required columns
      return data.filter(row =>
        row[config.x] && row[config.y] && row[config.value] !== undefined
      )

    case 'gantt':
      // For Gantt, ensure we have task, start, and end dates
      return data.filter(row =>
        row[config.task] && row[config.start] && row[config.end]
      )

    default:
      return data
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { datasetId, prompt } = await req.json()

    console.log('Received request:', { datasetId, prompt })

    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. RETRIEVE: Fetch dataset and column schema
    const { data: dataset, error: fetchError } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .single()

    if (fetchError) throw fetchError

    const columnSchema = dataset.column_schema

    // Download CSV data for both text and viz responses
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('datasets')
      .download(dataset.storage_object_path)

    if (downloadError) throw downloadError

    const csvText = await fileData.text()

    const parseResult: any = await new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: resolve,
        error: reject,
      })
    })

    const allData = parseResult.data

    // 2. AUGMENT: Try to use Groq, fallback to rule-based on error
    let response
    let usedFallback = false
    
    try {
      console.log('🎯 Attempting Groq API for prompt:', prompt)
      
      // Prepare comprehensive data context
      const sampleRows = allData.slice(0, 10).map((row, idx) => {
        const rowData = Object.entries(row).map(([k, v]) => `${k}=${v}`).join(', ')
        return `Row ${idx + 1}: ${rowData}`
      }).join('\n')
      
      // Calculate quick statistics for numeric columns
      const stats = {}
      Object.keys(columnSchema).forEach(col => {
        if (columnSchema[col].type === 'number') {
          const values = allData.map(row => row[col]).filter(v => v != null && !isNaN(v))
          if (values.length > 0) {
            const sum = values.reduce((a, b) => a + Number(b), 0)
            stats[col] = {
              count: values.length,
              min: Math.min(...values),
              max: Math.max(...values),
              avg: (sum / values.length).toFixed(2)
            }
          }
        } else if (columnSchema[col].type === 'category') {
          const uniqueValues = [...new Set(allData.map(row => row[col]).filter(v => v != null))]
          stats[col] = {
            uniqueCount: uniqueValues.length,
            values: uniqueValues.slice(0, 10)
          }
        }
      })
      
      const aiPrompt = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DATASET INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Total Rows**: ${allData.length}
**Total Columns**: ${Object.keys(columnSchema).length}

**Column Schema**:
${JSON.stringify(columnSchema, null, 2)}

**Statistical Summary**:
${JSON.stringify(stats, null, 2)}

**Sample Data** (First 10 rows):
${sampleRows}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ USER QUESTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"${prompt}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 EXAMPLES OF EXCELLENT RESPONSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Example 1 - TEXT Response (Analysis)**
Question: "What's the average sales?"
Response:
{
  "type": "text",
  "answer": "📊 **Average Sales Analysis**\\n\\nThe average sales across all ${allData.length} records is **$X,XXX.XX**.\\n\\n**Key Insights:**\\n- Highest sale: $X,XXX (Region Y)\\n- Lowest sale: $XXX (Region Z)\\n- Sales range: $X,XXX\\n- Standard deviation: $XXX (moderate variation)\\n\\n**Distribution:**\\n- 25% of sales are below $X,XXX\\n- 50% (median) are around $X,XXX\\n- 75% are below $X,XXX\\n\\nThis suggests a [pattern/trend]. Recommend focusing on [actionable insight]."
}

**Example 2 - TEXT Response (Comparison)**
Question: "Which region has the highest sales?"
Response:
{
  "type": "text",
  "answer": "🏆 **Regional Sales Ranking**\\n\\nBased on analysis of ${allData.length} records:\\n\\n**Top 3 Regions:**\\n1. **Region A** - $XX,XXX total sales (35% of total)\\n2. **Region B** - $XX,XXX total sales (28% of total)\\n3. **Region C** - $XX,XXX total sales (22% of total)\\n\\n**Performance Gap:**\\nRegion A outperforms Region B by $X,XXX (25% higher), indicating strong market presence.\\n\\n💡 **Insight**: Region A's success could be replicated in underperforming regions through similar strategies."
}

**Example 3 - TEXT Response (List/Count)**
Question: "How many unique products are there?"
Response:
{
  "type": "text",
  "answer": "📦 **Product Analysis**\\n\\nThe dataset contains **XX unique products** across ${allData.length} records.\\n\\n**Top Products:**\\n- Product A (XXX occurrences)\\n- Product B (XXX occurrences)\\n- Product C (XXX occurrences)\\n\\n**Product Distribution:**\\n- Most common: Product A appears in XX% of records\\n- Least common: Product Z appears in X% of records\\n- Average: Each product appears XXX times\\n\\nThis indicates [insight about product diversity/concentration]."
}

**Example 4 - VISUALIZATION Response**
Question: "Show me sales by region"
Response:
{
  "type": "viz",
  "chartType": "bar",
  "config": {
    "category": "Region",
    "value": "Sales",
    "title": "Sales Performance by Region",
    "xAxisLabel": "Region",
    "yAxisLabel": "Total Sales ($)",
    "unit": "$"
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 YOUR TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **Understand** the user's question deeply
2. **Analyze** the dataset using the provided statistics and sample data
3. **Calculate** any necessary values (don't guess - use actual data)
4. **Decide** whether TEXT or VIZ is most appropriate
5. **Respond** with comprehensive, insightful JSON

**Critical Reminders:**
- Use EXACT column names from the schema
- Perform REAL calculations based on statistics provided
- Be conversational and insightful (like ChatGPT/Claude)
- Format markdown beautifully with emojis and structure
- If unsure about data, acknowledge it honestly
- Add context, comparisons, and actionable insights

Now respond to the user's question with the appropriate JSON format (TEXT or VIZ).`

      response = await callGroq(aiPrompt)
      console.log('✅ Groq SUCCESS - Response type:', response.type)
      
      // Validate if it's a viz response
      if (response.type === 'viz') {
        const configCols = Object.values(response.config || {})
        const validCols = Object.keys(columnSchema)
        const invalid = configCols.filter(c => !validCols.includes(c))
        
        if (invalid.length > 0) {
          throw new Error(`Invalid columns: ${invalid.join(', ')}`)
        }
      }
      
    } catch (groqError) {
      console.error('⚠️ Groq FAILED, using fallback. Error:', groqError.message)
      usedFallback = true
      response = generateResponseFallback(prompt, columnSchema, allData)
      console.log('📊 Fallback response - Type:', response.type)
    }

    // 3. Handle TEXT responses (no visualization)
    if (response.type === 'text') {
      console.log('💬 Returning text answer:', response.answer)
      return new Response(
        JSON.stringify({
          type: 'text',
          insight: response.answer,
          usedFallback
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // 4. Handle VIZ responses - shape data and generate chart
    const chartSpec = { chartType: response.chartType, config: response.config }
    const shapedData = shapeData(allData, chartSpec)

    // 4. Generate insight (with fallback)
    let insight = 'Here is your visualization!'
    if (!usedFallback) {
      try {
        insight = await generateInsight(chartSpec, shapedData)
      } catch (insightError) {
        console.error('⚠️ Insight generation failed:', insightError.message)
        insight = `Showing ${chartSpec.chartType} chart of ${JSON.stringify(chartSpec.config)}`
      }
    } else {
      insight = `Showing ${chartSpec.chartType} chart based on your request`
    }

    // Return chart specification, data, and insight
    return new Response(
      JSON.stringify({
        chartSpec,
        chartData: shapedData,
        insight,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: any) { 
    console.error('Full Error:', error)

    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})