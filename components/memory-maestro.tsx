"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Volume2, VolumeX, Trophy, HelpCircle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import GameBoard from "@/components/game-board"
import StatsPanel from "@/components/stats-panel"
import AchievementsPanel from "@/components/achievements-panel"
import SettingsPanel from "@/components/settings-panel"
import HelpPanel from "@/components/help-panel"
import Confetti from "@/components/confetti"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { GameMode, Difficulty, GameStats, Settings as SettingsType } from "@/lib/types"

export default function MemoryMaestro() {
  const [activeView, setActiveView] = useState<"home" | "game" | "stats" | "achievements" | "settings" | "help">("home")
  const [gameMode, setGameMode] = useState<GameMode>("classic")
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameActive, setGameActive] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)
  const { toast } = useToast()

  const [settings, setSettings] = useLocalStorage<SettingsType>("memory-maestro-settings", {
    difficulty: "easy",
    speed: 1,
    strictMode: false,
    theme: "light",
    soundSet: "piano",
    volume: 0.7,
    muted: false,
  })

  const [stats, setStats] = useLocalStorage<GameStats>("memory-maestro-stats", {
    gamesPlayed: 0,
    highScores: {
      classic: { easy: 0, medium: 0, hard: 0 },
      timed: { easy: 0, medium: 0, hard: 0 },
      endless: { easy: 0, medium: 0, hard: 0 },
    },
    totalCorrect: 0,
    totalMistakes: 0,
    bestStreak: 0,
    achievements: [],
  })

  // Prevent unnecessary re-renders by memoizing the updateStats function
  const updateStats = useCallback(
    (newScore: number, mode: GameMode, difficulty: Difficulty) => {
      const newStats = { ...stats }
      newStats.gamesPlayed += 1

      if (newScore > (stats.highScores[mode][difficulty] || 0)) {
        newStats.highScores[mode][difficulty] = newScore

        // Show celebration for new high score
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)

        toast({
          title: "New High Score!",
          description: `You've set a new record of ${newScore} in ${mode} mode!`,
        })
      }

      setStats(newStats)
    },
    [stats, toast, setStats],
  )

  // Memoize the handleGameOver function
  const handleGameOver = useCallback(
    (score: number) => {
      setCurrentScore(score)
      updateStats(score, gameMode, settings.difficulty)
      setGameActive(false)
    },
    [updateStats, gameMode, settings.difficulty],
  )

  const startGame = useCallback((mode: GameMode) => {
    setGameMode(mode)
    setGameActive(true)
    setActiveView("game")
  }, [])

  const toggleMute = useCallback(() => {
    setSettings((prev) => ({ ...prev, muted: !prev.muted }))
  }, [setSettings])

  const updateVolume = useCallback(
    (value: number[]) => {
      setSettings((prev) => ({ ...prev, volume: value[0] }))
    },
    [setSettings],
  )

  return (
    <div
      className={cn(
        "w-full max-w-4xl mx-auto relative overflow-hidden rounded-xl shadow-xl transition-colors duration-300",
        settings.theme === "light" && "bg-white text-slate-900",
        settings.theme === "dark" && "bg-slate-900 text-white",
        settings.theme === "neon" && "bg-black text-white",
        settings.theme === "frosted" && "bg-white/20 backdrop-blur-lg text-white border border-white/20",
      )}
    >
      {showConfetti && <Confetti />}

      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b">
        <motion.h1
          className="text-2xl md:text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Memory Maestro<span className="text-purple-500">+</span>
        </motion.h1>

        <div className="flex items-center gap-2">
          {gameActive ? (
            <div className="text-lg font-semibold">Score: {currentScore}</div>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={toggleMute} className="rounded-full">
                {settings.muted ? <VolumeX /> : <Volume2 />}
              </Button>

              <Button variant="ghost" size="icon" onClick={() => setActiveView("stats")} className="rounded-full">
                <Trophy />
              </Button>

              <Button variant="ghost" size="icon" onClick={() => setActiveView("settings")} className="rounded-full">
                <Settings />
              </Button>

              <Button variant="ghost" size="icon" onClick={() => setActiveView("help")} className="rounded-full">
                <HelpCircle />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <AnimatePresence mode="wait">
          {activeView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">Select Game Mode</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GameModeCard
                  title="Classic Mode"
                  description="Follow the pattern and repeat it. Each round adds one more step."
                  icon="🎮"
                  onClick={() => startGame("classic")}
                />

                <GameModeCard
                  title="Timed Mode"
                  description="Race against the clock! Respond within the time limit."
                  icon="⏱️"
                  onClick={() => startGame("timed")}
                />

                <GameModeCard
                  title="Endless Mode"
                  description="Play until you make a mistake. How far can you go?"
                  icon="♾️"
                  onClick={() => startGame("endless")}
                />

                <GameModeCard
                  title="Free Play Mode"
                  description="Just have fun! Create your own melodies with no pressure."
                  icon="🎨"
                  onClick={() => startGame("freePlay")}
                />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="difficulty" className="whitespace-nowrap">
                    Difficulty:
                  </Label>
                  <select
                    id="difficulty"
                    value={settings.difficulty}
                    onChange={(e) => setSettings({ ...settings, difficulty: e.target.value as Difficulty })}
                    className="rounded-md border border-input bg-background px-3 py-1"
                  >
                    <option value="easy">Easy (4 buttons)</option>
                    <option value="medium">Medium (5 buttons)</option>
                    <option value="hard">Hard (6 buttons)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="speed" className="whitespace-nowrap">
                    Speed:
                  </Label>
                  <Slider
                    id="speed"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={[settings.speed]}
                    onValueChange={(value) => setSettings({ ...settings, speed: value[0] })}
                    className="w-32"
                  />
                  <span className="text-sm">{settings.speed}x</span>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="strict-mode"
                    checked={settings.strictMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, strictMode: checked })}
                  />
                  <Label htmlFor="strict-mode">Strict Mode</Label>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === "game" && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <GameBoard
                mode={gameMode}
                difficulty={settings.difficulty}
                speed={settings.speed}
                strictMode={settings.strictMode}
                soundSet={settings.soundSet}
                volume={settings.muted ? 0 : settings.volume}
                onGameOver={handleGameOver}
                onScoreChange={setCurrentScore}
              />

              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGameActive(false)
                    setActiveView("home")
                  }}
                >
                  <Home className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </div>
            </motion.div>
          )}

          {activeView === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs defaultValue="highscores">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="highscores">High Scores</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>
                <TabsContent value="highscores">
                  <StatsPanel stats={stats} />
                </TabsContent>
                <TabsContent value="achievements">
                  <AchievementsPanel achievements={stats.achievements} />
                </TabsContent>
              </Tabs>

              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={() => setActiveView("home")}>
                  <Home className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </div>
            </motion.div>
          )}

          {activeView === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsPanel settings={settings} onSettingsChange={setSettings} />

              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={() => setActiveView("home")}>
                  <Home className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </div>
            </motion.div>
          )}

          {activeView === "help" && (
            <motion.div
              key="help"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HelpPanel />

              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={() => setActiveView("home")}>
                  <Home className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm opacity-70">
        Memory Maestro+ &copy; {new Date().getFullYear()} | A React Simon Game
      </footer>
    </div>
  )
}

function GameModeCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string
  description: string
  icon: string
  onClick: () => void
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 rounded-xl shadow-md cursor-pointer border border-purple-500/20 hover:border-purple-500/40 transition-all"
      onClick={onClick}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </motion.div>
  )
}
