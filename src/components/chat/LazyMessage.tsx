import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useLazyLoading } from '../../hooks/useIntersectionObserver';
import { Message } from '../../stores/chatStore';
import { ChatMessage } from './ChatMessage';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface LazyMessageProps {
  message: Message;
  index: number;
}

const LazyMessage: React.FC<LazyMessageProps> = memo(({ message, index }) => {
  const { ref, shouldLoad } = useLazyLoading({
    threshold: 0.1,
    rootMargin: '50px'
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.05, 0.3) // Max delay of 300ms
      }}
      className="min-h-[80px] flex items-center"
    >
      {shouldLoad ? (
        <ChatMessage message={message} />
      ) : (
        <div className="w-full flex justify-center py-4">
          <LoadingSpinner variant="dots" size="sm" className="text-gray-400" />
        </div>
      )}
    </motion.div>
  );
});

LazyMessage.displayName = 'LazyMessage';

export { LazyMessage };