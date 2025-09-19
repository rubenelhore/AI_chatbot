import React from 'react'

interface ChatContainerProps {
  children: React.ReactNode
  className?: string
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
      {children}
    </div>
  )
}