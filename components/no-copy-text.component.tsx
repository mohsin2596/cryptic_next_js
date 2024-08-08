"use client";

import { useEffect, FC } from 'react';

interface NoCopyTextProps {
  text: string;
}

const NoCopyText: FC<NoCopyTextProps> = ({ text }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleCopy = (event: ClipboardEvent) => {
        event.preventDefault();
        if (event.clipboardData) {
          event.clipboardData.setData('text/plain', '');
        }
      };

      document.addEventListener('copy', handleCopy);

      return () => {
        document.removeEventListener('copy', handleCopy);
      };
    }
  }, []);

  return (
    <span
      style={{ userSelect: 'none' }}
      onMouseDown={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {text}
    </span>
  );
};

export default NoCopyText;
