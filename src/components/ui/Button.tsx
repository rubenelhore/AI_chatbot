import React from 'react'
import { motion } from 'framer-motion'
import { LoadingSpinner } from './LoadingSpinner'
import { buttonVariants } from './animations'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  title?: string
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  title
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out'

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  }

  const disabledStyles = isLoading || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'

  return (
    <motion.button
      type={type}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${className}
      `}
      onClick={onClick}
      disabled={isLoading || disabled}
      title={title}
      variants={buttonVariants}
      initial="idle"
      whileHover={!isLoading && !disabled ? "hover" : "idle"}
      whileTap={!isLoading && !disabled ? "tap" : "idle"}
      animate={isLoading ? "loading" : "idle"}
    >
      {isLoading && <LoadingSpinner className="mr-2" />}
      {children}
    </motion.button>
  )
}