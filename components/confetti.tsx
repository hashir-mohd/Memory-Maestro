"use client"

import { useEffect, useRef } from "react"

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 200
    const gravity = 0.3
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
    ]

    class Particle {
      x: number
      y: number
      color: string
      size: number
      velocity: { x: number; y: number }
      rotation: number
      rotationSpeed: number
      shape: "circle" | "square" | "triangle"

      constructor() {
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.size = Math.random() * 10 + 5
        this.velocity = {
          x: (Math.random() - 0.5) * 15,
          y: (Math.random() - 0.5) * 15,
        }
        this.rotation = Math.random() * 360
        this.rotationSpeed = (Math.random() - 0.5) * 10
        this.shape = Math.random() < 0.33 ? "circle" : Math.random() < 0.66 ? "square" : "triangle"
      }

      update() {
        this.velocity.y += gravity
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.rotation += this.rotationSpeed

        if (this.y > canvas.height) {
          this.y = canvas.height
          this.velocity.y *= -0.5
        }
      }

      draw() {
        if (!ctx) return

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        ctx.fillStyle = this.color

        if (this.shape === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, this.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (this.shape === "square") {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
        } else {
          // Triangle
          ctx.beginPath()
          ctx.moveTo(0, -this.size)
          ctx.lineTo(-this.size, this.size)
          ctx.lineTo(this.size, this.size)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()
      }
    }

    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    let animationId: number

    function animate() {
      animationId = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Stop animation after 3 seconds
      if (particles[0].y > canvas.height * 1.5) {
        cancelAnimationFrame(animationId)
      }
    }

    animate()

    // Clean up
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}
