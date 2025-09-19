import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  description
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  )
}