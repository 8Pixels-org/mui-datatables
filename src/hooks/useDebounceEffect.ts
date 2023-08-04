import {useEffect} from "react";

/**
 * React useEffect hook with debouncing implemented
 * @param effect
 * @param deps
 * @param delay
 */
export function useDebounceEffect(effect: () => void, deps: any, delay: number | undefined) {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
}
