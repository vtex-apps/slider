import { useEffect } from 'react'

/**
 * Hooks that sets a timeout that calls a passed function and is cleared if the stop condition is fulfilled
 * @param ttl : Time until call the fucntion again
 * @param call : Function that will be called
 * @param stop : Stop condition
 * @param deps : Dependencies array
 */
const useControlledTimeout = (
  ttl: number,
  call: () => any,
  stop: boolean,
  deps: Array<any>
) => {
  useEffect(() => {
    const timeout = setTimeout(() => call(), ttl)
    stop && clearTimeout(timeout)
    return () => clearTimeout(timeout)
  }, [stop, ...deps])
}

export default useControlledTimeout
