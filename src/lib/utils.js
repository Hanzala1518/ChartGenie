import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string
 */
export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Format a number with commas
 */
export function formatNumber(num) {
  if (typeof num !== 'number') return num
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Generate Coral Reef color palette for charts
 * 🌊 Based on #1ABC9C (Teal), #F1948A (Coral), and warm analogous colors
 */
export function getColorPalette() {
  return [
    '#1ABC9C', // Coral Teal
    '#F1948A', // Coral Pink
    '#E67E22', // Coral Orange
    '#16A085', // Coral Teal Dark
    '#F39C12', // Coral Amber
    '#D35400', // Coral Rust
    '#FAD7B0', // Coral Sand
    '#45B7D1', // Ocean Blue
    '#96CEB4', // Seafoam Green
    '#E08E79', // Warm Coral
    '#3498DB', // Sky Blue
    '#F8B500'  // Golden Sand
  ]
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Get status badge color
 */
export function getStatusColor(status) {
  const colors = {
    PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    ANALYZING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    READY: 'bg-green-500/20 text-green-400 border-green-500/30',
    ERROR: 'bg-red-500/20 text-red-400 border-red-500/30'
  }
  return colors[status] || colors.PENDING
}

/**
 * Truncate text
 */
export function truncate(text, length = 50) {
  if (!text || text.length <= length) return text
  return text.substring(0, length) + '...'
}
