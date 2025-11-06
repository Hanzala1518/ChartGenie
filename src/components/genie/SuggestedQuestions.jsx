import { Button } from '@/components/ui/Button'
import { Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Suggested questions chips - now uses dataset-specific suggestions from AI
 */
export function SuggestedQuestions({ onSelect, suggestedQuestions }) {
  // Fallback to default questions if none provided
  const defaultQuestions = [
    "Show me sales by region",
    "Compare revenue and profit",
    "What's the trend over time?",
    "Show me the distribution",
  ]

  const questions = suggestedQuestions && suggestedQuestions.length > 0 
    ? suggestedQuestions 
    : defaultQuestions

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lightbulb className="h-4 w-4" />
        <span>Suggested questions:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <motion.div
            key={question}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(question)}
              className="glass text-xs hover:bg-primary/20 hover:border-primary/40 transition-all"
            >
              {question}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
