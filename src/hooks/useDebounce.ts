import { useEffect, useCallback } from 'react';

export default function useDebounce(effect: (args: any) => any, dependencies: [any], delay: number) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(effect, dependencies);
    
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
