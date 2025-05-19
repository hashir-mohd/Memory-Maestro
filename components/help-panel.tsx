export default function HelpPanel() {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold mb-4">How to Play</h2>

      <div className="space-y-4">
        <section>
          <h3 className="text-lg font-semibold mb-2">Game Modes</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Classic Mode:</strong> The game shows a sequence of colors and sounds that you must repeat. Each
              round adds one more step to the sequence.
            </li>
            <li>
              <strong>Timed Mode:</strong> Similar to Classic Mode, but you must complete each sequence within a time
              limit that gets shorter as you progress.
            </li>
            <li>
              <strong>Endless Mode:</strong> Play until you make a mistake. How far can you go?
            </li>
            <li>
              <strong>Free Play Mode:</strong> No rules, just fun! Create your own melodies by tapping the buttons.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Difficulty Levels</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Easy:</strong> 4 buttons to remember
            </li>
            <li>
              <strong>Medium:</strong> 5 buttons to remember
            </li>
            <li>
              <strong>Hard:</strong> 6 buttons to remember
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Game Settings</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Speed:</strong> Adjust how quickly the sequence plays back
            </li>
            <li>
              <strong>Strict Mode:</strong> When enabled, any mistake ends the game immediately
            </li>
            <li>
              <strong>Theme:</strong> Choose from Light, Dark, Neon, or Frosted Glass visual styles
            </li>
            <li>
              <strong>Sound Set:</strong> Select different sound styles for the buttons
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Tips</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Try to associate colors with sounds to help remember the sequence</li>
            <li>Start with Easy difficulty and slower speeds to build your memory skills</li>
            <li>Challenge yourself with Strict Mode once you're comfortable with the game</li>
            <li>Use Free Play Mode to practice and get familiar with the sounds</li>
            <li>Try to beat your high scores in each mode and difficulty level</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
