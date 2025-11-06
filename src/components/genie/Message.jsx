import { cn } from '@/lib/utils'
import { User, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Format markdown-style text for display
 */
function formatText(text) {
  if (!text) return text
  
  return text
    // Bold: **text** → <strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Code: `text` → <code>
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-white/10 rounded text-xs">$1</code>')
    // Horizontal rule: --- → <hr>
    .replace(/\n---\n/g, '<hr class="my-3 border-white/20" />')
    // Headers: **Text**\n → larger bold
    .replace(/\*\*([^*]+)\*\*\n/g, '<div class="font-bold text-base mb-2">$1</div>')
    // Bullets with emojis preserved
    .replace(/^- (.*?)$/gm, '<div class="ml-4 mb-1">• $1</div>')
    // Numbered lists
    .replace(/^(\d+)\. (.*?)$/gm, '<div class="ml-4 mb-1">$1. $2</div>')
}

/**
 * Chat message component with user/AI styling
 */
export function Message({ message, isUser }) {
  const formattedText = isUser ? message.text : formatText(message.text)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-coral-teal to-coral-pink flex items-center justify-center animate-pulse-glow">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] rounded-md px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border"
        )}
      >
        <div 
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </motion.div>
  )
}
