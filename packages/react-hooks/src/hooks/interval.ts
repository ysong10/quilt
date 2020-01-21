import React from 'react';

export function useInterval(callback: () => void, delay: number) {
  React.useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}
