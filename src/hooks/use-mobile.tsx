
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check immediately
    checkIfMobile()
    
    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return isMobile
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<"mobile" | "tablet" | "desktop">("desktop")

  React.useEffect(() => {
    // Initial check
    const checkBreakpoint = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setBreakpoint("mobile")
      } else if (window.innerWidth < TABLET_BREAKPOINT) {
        setBreakpoint("tablet")
      } else {
        setBreakpoint("desktop")
      }
    }
    
    // Check immediately
    checkBreakpoint()
    
    // Add event listener for resize
    window.addEventListener("resize", checkBreakpoint)
    
    // Clean up
    return () => window.removeEventListener("resize", checkBreakpoint)
  }, [])

  return breakpoint
}

export function useDeviceSize() {
  const [deviceSize, setDeviceSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })

  React.useEffect(() => {
    const handleResize = () => {
      setDeviceSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return deviceSize
}

export function useIsTabletOrMobile() {
  const breakpoint = useBreakpoint()
  return breakpoint === "mobile" || breakpoint === "tablet"
}

export function useIsDesktop() {
  const breakpoint = useBreakpoint()
  return breakpoint === "desktop"
}
