"use client"

import { motion } from "framer-motion"
import type { GameStats } from "@/lib/types"

interface StatsPanelProps {
  stats: GameStats
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const totalPlays = stats.gamesPlayed
  const accuracy =
    totalPlays > 0 ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalMistakes)) * 100) : 0

  const getHighestScore = () => {
    let highest = 0

    Object.keys(stats.highScores).forEach((mode) => {
      Object.keys(stats.highScores[mode]).forEach((difficulty) => {
        const score = stats.highScores[mode][difficulty]
        if (score > highest) highest = score
      })
    })

    return highest
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Stats</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Games Played" value={totalPlays} />
        <StatCard title="Best Score" value={getHighestScore()} />
        <StatCard title="Best Streak" value={stats.bestStreak} />
        <StatCard title="Accuracy" value={`${accuracy}%`} />
      </div>

      <h3 className="text-lg font-semibold mb-3">High Scores</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Mode</th>
              <th className="text-center py-2">Easy</th>
              <th className="text-center py-2">Medium</th>
              <th className="text-center py-2">Hard</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Classic</td>
              <td className="text-center">{stats.highScores.classic.easy || "-"}</td>
              <td className="text-center">{stats.highScores.classic.medium || "-"}</td>
              <td className="text-center">{stats.highScores.classic.hard || "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Timed</td>
              <td className="text-center">{stats.highScores.timed.easy || "-"}</td>
              <td className="text-center">{stats.highScores.timed.medium || "-"}</td>
              <td className="text-center">{stats.highScores.timed.hard || "-"}</td>
            </tr>
            <tr>
              <td className="py-2">Endless</td>
              <td className="text-center">{stats.highScores.endless.easy || "-"}</td>
              <td className="text-center">{stats.highScores.endless.medium || "-"}</td>
              <td className="text-center">{stats.highScores.endless.hard || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <motion.div
      className="bg-purple-500/10 rounded-lg p-3 text-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <h3 className="text-sm font-medium opacity-70">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  )
}
