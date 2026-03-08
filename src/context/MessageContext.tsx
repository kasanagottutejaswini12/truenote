import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MessageData, defaultMessage } from '@/lib/message-types';

interface MessageContextType {
  message: MessageData;
  setMessage: React.Dispatch<React.SetStateAction<MessageData>>;
  updateMessage: (updates: Partial<MessageData>) => void;
}

const MessageContext = createContext<MessageContextType | null>(null);

export const useMessage = () => {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error('useMessage must be used within MessageProvider');
  return ctx;
};

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<MessageData>(defaultMessage);

  const updateMessage = (updates: Partial<MessageData>) => {
    setMessage(prev => ({ ...prev, ...updates }));
  };

  return (
    <MessageContext.Provider value={{ message, setMessage, updateMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
