import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp'
  icon?: React.ReactNode
}

export const PremiumButton = ({ 
  children, 
  className, 
  variant = 'primary', 
  icon,
  ...props 
}: PremiumButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Magnetic Effect Values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
    const centerPointX = left + width / 2
    const centerPointY = top + height / 2
    
    // Calculate distance from center
    const distanceX = e.clientX - centerPointX
    const distanceY = e.clientY - centerPointY
    
    // Magnetic pull strength (higher is stronger pull)
    x.set(distanceX * 0.2)
    y.set(distanceY * 0.2)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]'
      case 'outline':
        return 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
      case 'ghost':
        return 'text-primary hover:bg-accent hover:text-primary shadow-sm'
      case 'whatsapp':
        return 'bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]'
      default:
        return 'bg-primary text-white shadow-[0_10px_20px_rgba(31,77,58,0.2)] hover:shadow-[0_15px_30px_rgba(31,77,58,0.4)]'
    }
  }

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      style={{ x: xSpring, y: ySpring }}
      className={cn(
        'relative px-8 py-4 rounded-full font-medium flex items-center gap-3 transition-colors overflow-hidden group',
        getVariantStyles(),
        className
      )}
      {...props}
    >
      {/* Soft Glow Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-[shine_1.5s_ease-in-out_infinite]"
      />
      
      <span className="relative z-10 flex items-center gap-3 w-full justify-center">
        {children}
        {icon && (
          <motion.span
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center justify-center"
          >
            {icon}
          </motion.span>
        )}
      </span>
    </motion.button>
  )
}
