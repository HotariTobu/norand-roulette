import { CSSProperties, ReactNode, useEffect, useRef } from "react"
import useLocalStorageState from "use-local-storage-state"

const deltaTime = 50

export const Accelerator = (props: {
  attenuation: number
  increment: number
  children: ReactNode
}) => {
  const ref = useRef({
    speed: 0
  })

  const [angle, setAngle] = useLocalStorageState('angle', {
    defaultValue: 0
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      const speed = ref.current.speed -= props.attenuation
      if (speed < 0) {
        ref.current.speed = 0
        return
      }

      setAngle(angle => angle + speed)
    }, deltaTime)

    return () => clearInterval(intervalId)
  }, [props.attenuation])

  const boost = () => {
    ref.current.speed += props.increment
  }

  const style: CSSProperties = {
    transitionProperty: 'transform',
    transitionTimingFunction: 'linear',
    transitionDuration: `${deltaTime}ms`,
    transform: `rotate(${angle}rad)`,
  }

  return (
    <div style={style} onClick={boost}>
      {props.children}
    </div>
  )
}
