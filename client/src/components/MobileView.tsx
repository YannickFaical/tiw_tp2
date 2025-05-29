import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQna } from '../context/QnaContext'

export const MobileView = () => {
  const { eventId } = useParams()
  const { setCurrentEvent } = useQna()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [gesturePoints, setGesturePoints] = useState<number[][]>([])

  useEffect(() => {
    if (eventId) {
      setCurrentEvent(eventId)
    }
  }, [eventId, setCurrentEvent])

  // Gestion du dessin
  const startDrawing = (e: React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const point = [
      e.touches[0].clientX - rect.left,
      e.touches[0].clientY - rect.top
    ]
    
    setIsDrawing(true)
    setGesturePoints([point])
  }

  const draw = (e: React.TouchEvent) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const newPoint = [
      e.touches[0].clientX - rect.left,
      e.touches[0].clientY - rect.top
    ]
    
    setGesturePoints(prev => [...prev, newPoint])
    redrawCanvas()
  }

  const endDrawing = () => {
    if (gesturePoints.length > 10) {
      recognizeGesture()
    }
    setIsDrawing(false)
    setGesturePoints([])
  }

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Ajustement de la taille
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    
    // Dessin
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 4
    ctx.beginPath()
    
    gesturePoints.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point[0], point[1])
      } else {
        ctx.lineTo(point[0], point[1])
      }
    })
    
    ctx.stroke()
  }

  const recognizeGesture = () => {
    // Calcul des différences
    const firstY = gesturePoints[0][1]
    const lastY = gesturePoints[gesturePoints.length - 1][1]
    const deltaY = lastY - firstY

    // Seuil de reconnaissance
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        console.log("Gesture: Swipe down")
        // Action pour passer à la question suivante
      } else {
        console.log("Gesture: Swipe up") 
        // Action pour revenir à la question précédente
      }
    }
  }

  return (
    <div className="h-full">
      <canvas
        ref={canvasRef}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        className="w-full h-full touch-none"
      />
    </div>
  )
}