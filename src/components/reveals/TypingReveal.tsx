import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  content: string;
  onComplete: () => void;
  style?: React.CSSProperties;
}

const TypingReveal: React.FC<Props> = ({ content, onComplete, style }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < content.length) {
        setDisplayed(content.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onComplete();
      }
    }, 40);
    return () => clearInterval(interval);
  }, [content, onComplete]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p className="text-lg leading-relaxed whitespace-pre-wrap" style={style}>
        {displayed}
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            |
          </motion.span>
        )}
      </p>
    </motion.div>
  );
};

export default TypingReveal;
