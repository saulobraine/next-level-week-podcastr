import { useEffect, useRef } from "react";

type useKeyProps = {

}

export function useKey(key: string, callback: () => void) {

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  })

  useEffect(() => {
    function handle(event: KeyboardEvent) {
      if (event.code === key) {
        callbackRef.current();
        event.preventDefault();
      }
    }

    document.addEventListener("keypress", handle);
    return () => document.removeEventListener("keypress", handle);

  }, [key]);
}