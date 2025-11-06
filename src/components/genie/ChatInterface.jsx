import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Message } from './Message'
import { SuggestedQuestions } from './SuggestedQuestions'
import { ChartCard } from '@/components/charts/ChartCard'
import { useGenie } from '@/hooks/useGenie'
import { Send, Loader2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ChatInterface({ datasetId, dataset }) {
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your ChartGenie. Ask me anything about your data, and I'll create beautiful visualizations for you!",
      isUser: false,
    }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const genie = useGenie()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text = input) => {
    if (!text.trim() || genie.isPending) return

    const userMessage = { text, isUser: true }
    setMessages(prev => {
      const newMsgs = [...prev, userMessage]
      return newMsgs.length > 20 ? newMsgs.slice(-20) : newMsgs // NEW: Prune to last 20
    })
    setInput('')

    // Add loading message
    const loadingMessage = { text: 'Analyzing your question...', isUser: false, isLoading: true }
    setMessages(prev => [...prev, loadingMessage])

    try {
      // NEW: Include conversation history context (last 3 exchanges)
      const history = messages
        .filter(m => !m.isLoading)
        .slice(-6) // Last 3 user/genie pairs
        .map(m => `${m.isUser ? 'User' : 'Genie'}: ${m.text}`)
        .join('\n')

      const result = await genie.mutateAsync({
        datasetId,
        prompt: `${history}\n\nLatest: ${text}` // Append history + current
      })

      // Handle TEXT responses (no chart)
      if (result.type === 'text') {
        setMessages(prev => {
          const filtered = prev.filter(m => !m.isLoading)
          return [
            ...filtered,
            {
              text: result.insight,
              isUser: false,
            }
          ]
        })
        return
      }

      // Filter out map charts (not supported yet - missing GeoJSON)
      if (result.chartSpec?.chartType === 'map') {
        setMessages(prev => {
          const filtered = prev.filter(m => !m.isLoading)
          return [
            ...filtered,
            {
              text: "I understand you want a map visualization, but geographic maps aren't available yet. Try asking for a bar chart, line chart, scatter plot, or treemap instead!",
              isUser: false,
              error: true
            }
          ]
        })
        return
      }

      // Remove loading message and add result (VISUALIZATION)
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isLoading)
        return [
          ...filtered,
          {
            text: result.insight || 'Here\'s your visualization!',
            isUser: false,
            chartSpec: result.chartSpec,
            chartData: result.chartData || result.aggregatedData // NEW: Handle aggregatedData from auto-charts
          }
        ].slice(-20) // Prune to last 20 messages
      })
    } catch (error) {
      console.error('Genie chat error:', error)
      // FIXED: More specific error message
      const errMsg = error.message.includes('404')
        ? 'AI service temporarily unavailable - using smart fallback.'
        : error.message

      setMessages(prev => {
        const filtered = prev.filter(m => !m.isLoading)
        return [
          ...filtered,
          {
            text: `Sorry, I encountered an error: ${errMsg}. Please check your dataset and try again.`,
            isUser: false,
            error: true
          }
        ]
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full glass-card">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral-teal to-coral-pink flex items-center justify-center animate-pulse-glow">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold gradient-text">ChartGenie</h2>
            <p className="text-sm text-muted-foreground">Your AI Visualization Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <div key={index}>
              <Message message={message} isUser={message.isUser} />
              {message.chartSpec && message.chartData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="ml-11 mb-4"
                >
                  <ChartCard
                    title={message.chartSpec.config.title || 'Generated Chart'}
                    chartSpec={message.chartSpec}
                    chartData={message.chartData}
                  />
                </motion.div>
              )}
              {message.isLoading && (
                <div className="ml-11 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating visualization...</span>
                </div>
              )}
            </div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4">
          <SuggestedQuestions onSelect={handleSend} suggestedQuestions={dataset?.suggested_questions} />
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to create a chart..."
            disabled={genie.isPending}
            className="flex-1"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || genie.isPending}
            size="icon"
            className="shrink-0"
          >
            {genie.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}