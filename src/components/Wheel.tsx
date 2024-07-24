import { useLayoutEffect, useRef, useState } from "react"
import { hsl } from 'color'

export const Wheel = (props: {
  items: string[]
}) => {
  const itemCount = props.items.length

  const ref = useRef([] as SVGTextElement[])
  const [x, setX] = useState(0)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    if (itemCount === 0) {
      return
    }

    const rects = ref.current.map(element =>
      element.getBBox()
    )

    const max = rects.reduce((prevMax, rect) => ({
      width: Math.max(prevMax.width, rect.width),
      height: Math.max(prevMax.height, rect.height),
    }), {
      width: 0,
      height: 0,
    })

    const itemBoxRect = getItemBoxRect(itemCount, max.width, max.height)
    if (isNaN(itemBoxRect.x) || isNaN(itemBoxRect.height)) {
      return
    }

    setX(itemBoxRect.x)
    setHeight(itemBoxRect.height)
  }, [itemCount, props.items.join(',')])

  if (itemCount < 2) {
    return
  }

  const setRef = (element: SVGTextElement | null, index: number) => {
    if (element === null) {
      delete ref.current[index]
    }
    else {
      ref.current[index] = element
    }
  }

  const itemsWithId = props.items.map((item, index) => ({
    item,
    index,
    id: `${item}-${index}`,
  }))
  const centralAngle = 360 / itemCount
  const arcAngle = Math.PI / itemCount
  const arcX = Math.cos(arcAngle)
  const arcY = Math.sin(arcAngle)

  return (
    <svg viewBox="-1.1 -1.1 2.2 2.2">
      {itemsWithId.map(({ item, index, id }) => (
        <text visibility="hidden" ref={e => setRef(e, index)} key={id}>{item}</text>
      ))}

      {itemsWithId.map(({ item, index, id }) => (
        <g transform={`rotate(${index * centralAngle})`} key={id}>
          <path stroke="black" strokeWidth="0.001" d={`M0 0 L${arcX} ${arcY} A1 1 0 0 0 ${arcX} ${-arcY} Z`} fill={
            hsl(index * centralAngle, 100, 80).hex()
          } />
          <text textAnchor="end" alignmentBaseline="central" fill="black" x={x} fontSize={height * 0.7}>{item}</text>
        </g>
      ))}

      <circle cx="0" cy="0" r="0.1" stroke="black" strokeWidth="0.001" fill="white"/>
    </svg>
  )
}

const getItemBoxRect = (count: number, width: number, height: number) => {
  const { PI, sqrt, sin, cos } = Math
  const theta = 2 * PI / count
  const aspectRatio = width / height
  const radiusRatio = 1 / sqrt(2 * aspectRatio ** 2 * (1 - cos(theta)) + 2 * aspectRatio * sin(theta) + 1)

  return {
    x: sqrt(1 - (radiusRatio * sin(theta / 2)) ** 2),
    height: 2 * radiusRatio * sin(theta / 2),
  }
}
