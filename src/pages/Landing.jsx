import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import { Button } from '@/components/ui/Button'
import { Sparkles, BarChart3, Zap, Shield, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Landing Page with Login/Signup
 */
export function Landing() {
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      {/* Decorative elements - Coral Reef theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-coral-teal/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-pink/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral-teal to-coral-pink flex items-center justify-center animate-pulse-glow">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold gradient-text">ChartGenie</h1>
          </div>
          <p className="text-xl text-white drop-shadow-lg max-w-2xl mx-auto mb-8">
            Transform your CSV files into beautiful, interactive visualizations with the power of AI
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {[
              { icon: Zap, text: 'Instant Analysis' },
              { icon: BarChart3, text: 'Smart Charts' },
              { icon: Sparkles, text: 'AI-Powered' },
              { icon: Shield, text: 'Secure' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full flex items-center gap-2"
              >
                <feature.icon className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Auth Forms */}
        <div className="flex justify-center mb-16">
          {showSignup ? <SignupForm /> : <LoginForm />}
        </div>

        {/* Toggle Auth Mode */}
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setShowSignup(!showSignup)}
            className="text-white hover:text-white/80 drop-shadow-lg"
          >
            {showSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </Button>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Upload,
              title: 'Upload & Analyze',
              description: 'Drop your CSV file and watch as ChartGenie automatically detects data types and generates insights'
            },
            {
              icon: Sparkles,
              title: 'Ask the Genie',
              description: 'Use natural language to create custom visualizations. Just ask and the AI does the rest'
            },
            {
              icon: BarChart3,
              title: 'Beautiful Charts',
              description: 'Get stunning visualizations with bar, line, scatter, heat maps, geographic maps, and more'
            }
          ].map((feature, idx) => (
            <div key={feature.title} className="backdrop-blur-xl bg-white/90 dark:bg-stone-900/90 border border-white/20 rounded-md shadow-2xl p-6">
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-coral-teal/20 to-coral-pink/20 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-coral-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2 gradient-text">{feature.title}</h3>
              <p className="text-stone-600 dark:text-stone-400">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function Upload({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  )
}
