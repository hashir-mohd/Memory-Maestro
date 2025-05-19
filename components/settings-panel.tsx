"use client"

import type React from "react"

import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Settings, Difficulty, Theme, SoundSet } from "@/lib/types"

interface SettingsPanelProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export default function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const handleThemeChange = (theme: Theme) => {
    onSettingsChange({ ...settings, theme })
  }

  const handleSoundSetChange = (soundSet: SoundSet) => {
    onSettingsChange({ ...settings, soundSet })
  }

  const handleVolumeChange = (value: number[]) => {
    onSettingsChange({ ...settings, volume: value[0] })
  }

  const handleMuteToggle = () => {
    onSettingsChange({ ...settings, muted: !settings.muted })
  }

  const handleStrictModeToggle = () => {
    onSettingsChange({ ...settings, strictMode: !settings.strictMode })
  }

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({ ...settings, difficulty: e.target.value as Difficulty })
  }

  const handleSpeedChange = (value: number[]) => {
    onSettingsChange({ ...settings, speed: value[0] })
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Theme</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ThemeButton
              theme="light"
              label="Light"
              isActive={settings.theme === "light"}
              onClick={() => handleThemeChange("light")}
            />
            <ThemeButton
              theme="dark"
              label="Dark"
              isActive={settings.theme === "dark"}
              onClick={() => handleThemeChange("dark")}
            />
            <ThemeButton
              theme="neon"
              label="Neon"
              isActive={settings.theme === "neon"}
              onClick={() => handleThemeChange("neon")}
            />
            <ThemeButton
              theme="frosted"
              label="Frosted"
              isActive={settings.theme === "frosted"}
              onClick={() => handleThemeChange("frosted")}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Sound Set</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SoundButton
              soundSet="piano"
              label="Piano"
              isActive={settings.soundSet === "piano"}
              onClick={() => handleSoundSetChange("piano")}
            />
            <SoundButton
              soundSet="synth"
              label="Synth"
              isActive={settings.soundSet === "synth"}
              onClick={() => handleSoundSetChange("synth")}
            />
            <SoundButton
              soundSet="retro"
              label="Retro"
              isActive={settings.soundSet === "retro"}
              onClick={() => handleSoundSetChange("retro")}
            />
            <SoundButton
              soundSet="drums"
              label="Drums"
              isActive={settings.soundSet === "drums"}
              onClick={() => handleSoundSetChange("drums")}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Audio</h3>
          <div className="flex items-center gap-4 mb-2">
            <Label htmlFor="volume" className="w-20">
              Volume
            </Label>
            <Slider
              id="volume"
              min={0}
              max={1}
              step={0.1}
              value={[settings.volume]}
              onValueChange={handleVolumeChange}
              disabled={settings.muted}
              className="flex-1"
            />
            <span className="w-8 text-right">{Math.round(settings.volume * 100)}%</span>
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="mute" className="w-20">
              Mute
            </Label>
            <Switch id="mute" checked={settings.muted} onCheckedChange={handleMuteToggle} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Game Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="difficulty" className="w-20">
                Difficulty
              </Label>
              <select
                id="difficulty"
                value={settings.difficulty}
                onChange={handleDifficultyChange}
                className="flex-1 rounded-md border border-input bg-background px-3 py-1"
              >
                <option value="easy">Easy (4 buttons)</option>
                <option value="medium">Medium (5 buttons)</option>
                <option value="hard">Hard (6 buttons)</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="speed" className="w-20">
                Speed
              </Label>
              <Slider
                id="speed"
                min={0.5}
                max={2}
                step={0.1}
                value={[settings.speed]}
                onValueChange={handleSpeedChange}
                className="flex-1"
              />
              <span className="w-8 text-right">{settings.speed}x</span>
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="strict-mode" className="w-20">
                Strict Mode
              </Label>
              <Switch id="strict-mode" checked={settings.strictMode} onCheckedChange={handleStrictModeToggle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThemeButton({
  theme,
  label,
  isActive,
  onClick,
}: {
  theme: Theme
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`p-3 rounded-lg border transition-all ${
        isActive
          ? "border-purple-500 bg-purple-500/20"
          : "border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
      }`}
      onClick={onClick}
    >
      <div
        className={`w-full h-8 rounded mb-2 ${
          theme === "light"
            ? "bg-white border border-gray-200"
            : theme === "dark"
              ? "bg-gray-900 border border-gray-800"
              : theme === "neon"
                ? "bg-black border border-purple-500"
                : "bg-white/20 backdrop-blur border border-white/30"
        }`}
      />
      <div className="text-sm font-medium">{label}</div>
    </button>
  )
}

function SoundButton({
  soundSet,
  label,
  isActive,
  onClick,
}: {
  soundSet: SoundSet
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`p-3 rounded-lg border transition-all ${
        isActive
          ? "border-purple-500 bg-purple-500/20"
          : "border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-center mb-2">
        {soundSet === "piano" && "🎹"}
        {soundSet === "synth" && "🎛️"}
        {soundSet === "retro" && "👾"}
        {soundSet === "drums" && "🥁"}
      </div>
      <div className="text-sm font-medium">{label}</div>
    </button>
  )
}
