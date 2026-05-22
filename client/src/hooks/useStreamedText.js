import { useCallback, useEffect, useRef, useState } from 'react';
import { createStreamReveal } from '../lib/streamReveal';

/**
 * Reveals text incrementally. Cleans up on unmount or when a new stream starts.
 */
export function useStreamedText() {
  const [displayText, setDisplayText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const revealRef = useRef(null);

  const stop = useCallback(() => {
    revealRef.current?.stop();
    setIsStreaming(false);
  }, []);

  const start = useCallback(
    (fullText) => {
      revealRef.current?.stop();

      const reveal = createStreamReveal((partial, done) => {
        setDisplayText(partial);
        setIsStreaming(!done);
      });

      revealRef.current = reveal;
      reveal.start(fullText);

      return reveal.stop;
    },
    []
  );

  useEffect(() => () => revealRef.current?.stop(), []);

  return { displayText, isStreaming, start, stop, setDisplayText };
}
