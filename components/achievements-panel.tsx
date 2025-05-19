"use client"

import { motion } from "framer-motion"
import { Award, Lock } from "lucide-react"

interface AchievementsPanelProps {
  achievements: string[]
}

// Define all possible achievements
const ALL_ACHIEVEMENTS = [
  {
    id: "perfect10",
    name: "Perfect 10",
    description: "Complete 10 rounds without a mistake",
    icon: "🎯",
  },
  {
    id: "speedDemon",
    name: "Speed Demon",
    description: "Complete a round with less than 1 second per move",
    icon: "⚡",
  },
  {
    id: "memoryMaster",
    name: "Memory Master",
    description: "Reach round 20 in any mode",
    icon: "🧠",
  },
  {
    id: "hardcorePlayer",
    name: "Hardcore Player",
    description: "Complete 10 rounds on hard difficulty",
    icon: "💪",
  },
  {
    id: "musicMaestro",
    name: "Music Maestro",
    description: "Play 50 notes in Free Play mode",
    icon: "🎵",
  },
  {
    id: "timeWizard",
    name: "Time Wizard",
    description: "Win a timed game with more than 3 seconds left",
    icon: "⏰",
  },
  {
    id: "endlessExplorer",
    name: "Endless Explorer",
    description: "Reach round 30 in Endless mode",
    icon: "🚀",
  },
  {
    id: "perfectMemory",
    name: "Perfect Memory",
    description: "Complete a game with 100% accuracy",
    icon: "✨",
  },
]

export default function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Achievements</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = achievements.includes(achievement.id)

          return (
            <motion.div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                isUnlocked ? "border-purple-500/50 bg-purple-500/10" : "border-gray-500/20 bg-gray-500/5 opacity-70"
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{achievement.name}</h3>
                    {isUnlocked ? (
                      <Award className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Lock className="h-4 w-4 opacity-50" />
                    )}
                  </div>
                  <p className="text-sm opacity-80">{achievement.description}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
