"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { GameMode, Difficulty, SoundSet } from "@/lib/types"
import { cn } from "@/lib/utils"

// Button colors for different themes
const BUTTON_COLORS = {
  easy: [
    { bg: "bg-red-500", active: "bg-red-300", shadow: "shadow-red-600/50" },
    { bg: "bg-green-500", active: "bg-green-300", shadow: "shadow-green-600/50" },
    { bg: "bg-blue-500", active: "bg-blue-300", shadow: "shadow-blue-600/50" },
    { bg: "bg-yellow-500", active: "bg-yellow-300", shadow: "shadow-yellow-600/50" },
  ],
  medium: [
    { bg: "bg-red-500", active: "bg-red-300", shadow: "shadow-red-600/50" },
    { bg: "bg-green-500", active: "bg-green-300", shadow: "shadow-green-600/50" },
    { bg: "bg-blue-500", active: "bg-blue-300", shadow: "shadow-blue-600/50" },
    { bg: "bg-yellow-500", active: "bg-yellow-300", shadow: "shadow-yellow-600/50" },
    { bg: "bg-purple-500", active: "bg-purple-300", shadow: "shadow-purple-600/50" },
  ],
  hard: [
    { bg: "bg-red-500", active: "bg-red-300", shadow: "shadow-red-600/50" },
    { bg: "bg-green-500", active: "bg-green-300", shadow: "shadow-green-600/50" },
    { bg: "bg-blue-500", active: "bg-blue-300", shadow: "shadow-blue-600/50" },
    { bg: "bg-yellow-500", active: "bg-yellow-300", shadow: "shadow-yellow-600/50" },
    { bg: "bg-purple-500", active: "bg-purple-300", shadow: "shadow-purple-600/50" },
    { bg: "bg-orange-500", active: "bg-orange-300", shadow: "shadow-orange-600/50" },
  ],
}

// Sound frequencies for different sound sets
const SOUND_FREQUENCIES = {
  piano: [261.63, 329.63, 392.0, 523.25, 659.25, 783.99],
  synth: [200, 300, 400, 500, 600, 700],
  retro: [150, 200, 250, 300, 350, 400],
  drums: [100, 150, 200, 250, 300, 350],
}

interface GameBoardProps {
  mode: GameMode
  difficulty: Difficulty
  speed: number
  strictMode: boolean
  soundSet: SoundSet
  volume: number
  onGameOver: (score: number) => void
  onScoreChange: (score: number) => void
}

export default function GameBoard({
  mode,
  difficulty,
  speed,
  strictMode,
  soundSet,
  volume,
  onGameOver,
  onScoreChange,
}: GameBoardProps) {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeButton, setActiveButton] = useState<number | null>(null)
  const [gameStatus, setGameStatus] = useState<"ready" | "playing" | "gameOver">("ready")
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [round, setRound] = useState(1)
  const audioContext = useRef<AudioContext | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const buttonCount = difficulty === "easy" ? 4 : difficulty === "medium" ? 5 : 6
  const buttonColors = BUTTON_COLORS[difficulty]
  const frequencies = SOUND_FREQUENCIES[soundSet]

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    return () => {
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  // Play sound for a button
  const playSound = useCallback(
    (index: number, duration = 300) => {
      if (!audioContext.current || volume === 0) return

      const oscillator = audioContext.current.createOscillator()
      const gainNode = audioContext.current.createGain()

      oscillator.type =
        soundSet === "retro" ? "square" : soundSet === "synth" ? "sawtooth" : soundSet === "drums" ? "triangle" : "sine"
      oscillator.frequency.setValueAtTime(frequencies[index], audioContext.current.currentTime)

      gainNode.gain.setValueAtTime(volume, audioContext.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + duration / 1000)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.current.destination)

      oscillator.start()
      oscillator.stop(audioContext.current.currentTime + duration / 1000)
    },
    [frequencies, soundSet, volume],
  )

  // Vibrate device if supported (for mobile)
  const vibrate = useCallback((duration = 50) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(duration)
    }
  }, [])

  // Handle game over
  const handleGameOver = useCallback(() => {
    if (gameStatus !== "gameOver") {
      setGameStatus("gameOver")
      onGameOver(sequence.length - 1)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        setTimeLeft(null)
      }

      toast({
        title: "Game Over!",
        description: `You reached round ${sequence.length}!`,
      })
    }
  }, [sequence.length, onGameOver, toast, gameStatus])

  // Play the current sequence
  const playSequence = useCallback(
    (currentSequence: number[]) => {
      if (isPlaying) return // Prevent multiple calls

      setIsPlaying(true)
      let i = 0

      const interval = setInterval(() => {
        if (i < currentSequence.length) {
          setActiveButton(currentSequence[i])
          playSound(currentSequence[i])

          setTimeout(() => {
            setActiveButton(null)
          }, 500 / speed)

          i++
        } else {
          clearInterval(interval)
          setIsPlaying(false)

          // Start timer for timed mode
          if (mode === "timed") {
            const timeLimit = Math.max(5, 10 - Math.floor(currentSequence.length / 3))
            setTimeLeft(timeLimit)

            if (timerRef.current) {
              clearInterval(timerRef.current)
            }

            timerRef.current = setInterval(() => {
              setTimeLeft((prev) => {
                if (prev === null || prev <= 1) {
                  if (timerRef.current) clearInterval(timerRef.current)
                  if (prev === 1) {
                    handleGameOver()
                  }
                  return null
                }
                return prev - 1
              })
            }, 1000)
          }
        }
      }, 800 / speed)

      return () => clearInterval(interval)
    },
    [speed, mode, playSound, isPlaying, handleGameOver],
  )

  // Start a new game
  const startGame = useCallback(() => {
    const newSequence = [Math.floor(Math.random() * buttonCount)]
    setSequence(newSequence)
    setPlayerSequence([])
    setGameStatus("playing")
    setRound(1)
    onScoreChange(0)

    // Start with a delay to give player time to prepare
    setTimeout(() => {
      playSequence(newSequence)
    }, 1000)
  }, [buttonCount, onScoreChange, playSequence])

  // Handle player button press
  const handleButtonPress = useCallback(
    (index: number) => {
      if (isPlaying || gameStatus !== "playing") return

      setActiveButton(index)
      playSound(index)
      vibrate()

      const newPlayerSequence = [...playerSequence, index]
      setPlayerSequence(newPlayerSequence)

      // Check if the player's move is correct
      if (index !== sequence[playerSequence.length]) {
        // Wrong move
        playSound(buttonCount - 1, 1000) // Play error sound
        vibrate(200)

        if (strictMode || mode === "endless") {
          handleGameOver()
        } else {
          toast({
            title: "Oops!",
            description: "Wrong button! Try again.",
            variant: "destructive",
          })

          setTimeout(() => {
            setPlayerSequence([])
            playSequence(sequence)
          }, 1000)
        }
      } else {
        // Correct move
        // Check if the player completed the sequence
        if (newPlayerSequence.length === sequence.length) {
          onScoreChange(sequence.length)

          // Clear timer if in timed mode
          if (mode === "timed" && timerRef.current) {
            clearInterval(timerRef.current)
            setTimeLeft(null)
          }

          // Add a new step to the sequence
          setTimeout(() => {
            const newSequence = [...sequence, Math.floor(Math.random() * buttonCount)]
            setSequence(newSequence)
            setPlayerSequence([])
            setRound(round + 1)

            // Show success message for significant milestones
            if (newSequence.length % 5 === 0) {
              toast({
                title: "Great job!",
                description: `You've reached round ${newSequence.length}!`,
              })
            }

            playSequence(newSequence)
          }, 1000)
        }
      }

      setTimeout(() => {
        setActiveButton(null)
      }, 300)
    },
    [
      isPlaying,
      gameStatus,
      playerSequence,
      sequence,
      buttonCount,
      strictMode,
      mode,
      round,
      playSound,
      vibrate,
      onScoreChange,
      playSequence,
    ],
  )

  // Free play mode - just play sounds without game logic
  const handleFreePlayPress = useCallback(
    (index: number) => {
      setActiveButton(index)
      playSound(index)
      vibrate()

      setTimeout(() => {
        setActiveButton(null)
      }, 300)
    },
    [playSound, vibrate],
  )

  // Start game automatically
  useEffect(() => {
    if (mode === "freePlay") {
      setGameStatus("playing")
    } else if (gameStatus === "ready") {
      startGame()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [mode, startGame, gameStatus])

  // Calculate button positions based on difficulty
  const getButtonLayout = () => {
    if (difficulty === "easy") {
      return "grid-cols-2 grid-rows-2"
    } else if (difficulty === "medium") {
      return "grid-cols-3 grid-rows-2"
    } else {
      return "grid-cols-3 grid-rows-2"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 flex items-center justify-between w-full">
        <div className="text-lg font-semibold">Round: {mode === "freePlay" ? "Free Play" : round}</div>

        {mode === "timed" && timeLeft !== null && (
          <div className={cn("text-lg font-bold", timeLeft <= 3 && "text-red-500 animate-pulse")}>
            Time: {timeLeft}s
          </div>
        )}

        {mode !== "freePlay" && <div className="text-lg font-semibold">Score: {sequence.length - 1}</div>}
      </div>

      <motion.div
        className={cn("grid gap-4 w-full max-w-md mx-auto", getButtonLayout())}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {Array.from({ length: buttonCount }).map((_, index) => (
          <motion.button
            key={index}
            className={cn(
              "aspect-square rounded-xl shadow-lg transition-all",
              buttonColors[index].bg,
              buttonColors[index].shadow,
              "hover:brightness-110 active:brightness-90",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",
              activeButton === index && "brightness-150 scale-95",
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={activeButton === index ? { scale: [1, 0.95, 1], transition: { duration: 0.3 } } : {}}
            onClick={() => (mode === "freePlay" ? handleFreePlayPress(index) : handleButtonPress(index))}
            disabled={isPlaying || gameStatus !== "playing"}
            aria-label={`Game button ${index + 1}`}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {gameStatus === "gameOver" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 text-center"
          >
            <h3 className="text-xl font-bold mb-2">Game Over!</h3>
            <p className="mb-4">You reached round {sequence.length}!</p>
            <Button onClick={startGame}>Play Again</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === "freePlay" && (
        <div className="mt-6 text-center text-sm opacity-70">
          Free Play Mode: Click buttons to create your own melodies!
        </div>
      )}
    </div>
  )
}
