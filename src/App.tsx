import { InformationCircleIcon } from '@heroicons/react/outline'
import { ChartBarIcon } from '@heroicons/react/outline'
import { useState, useEffect, useCallback } from 'react'
import { Alert } from './components/alerts/Alert'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { AboutModal } from './components/modals/AboutModal'
import { InfoModal } from './components/modals/InfoModal'
import { WinModal } from './components/modals/WinModal'
import { StatsModal } from './components/modals/StatsModal'
import { isWordInWordList, isWinningWord, solution } from './lib/words'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from './lib/localStorage'

function App() {
  const [currentGuess, setCurrentGuess] = useState('')
  const [isWinningModalOpen, setIsWinningModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [isNotEnoughLetters, setIsNotEnoughLetters] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false)
  const [isLosingAlertOpen, setIsLosingAlertOpen] = useState(false)
  const [showCopyToClipboardComplete, setShowCopyToClipboardComplete] = useState(false)
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (loaded?.solution !== solution) {
      return []
    }
    return loaded.guesses
  })

  const [stats, setStats] = useState(() => loadStats())

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution })
  }, [guesses])

  const isWinningGame = guesses.length > 0 && isWinningWord(guesses[guesses.length - 1])
  const isLosingGame = guesses.length === 6 && !isWinningGame
  const isInputDisabled = isWinningGame || isLosingGame

  useEffect(() => {
    if (isWinningGame) {
      setStats(s => addStatsForCompletedGame(s, guesses.length))
      setIsWinningModalOpen(true)
    }
    if (isLosingGame) {
      setStats(s => addStatsForCompletedGame(s, -1))
      setIsLosingAlertOpen(true)
      setTimeout(() => {
        setIsLosingAlertOpen(false)
      }, 2000)
    }
  }, [isWinningGame, isLosingGame, guesses.length])

  useEffect(() => {
    if (guesses.length === 1) {
      gtag('event', 'first_guess', { word: guesses[0] })
    }
  }, [guesses])

  const onChar = useCallback((value: string) => {
    if (!isInputDisabled && currentGuess.length < 5) {
      setCurrentGuess(currGuess => `${currGuess}${value}`)
    }
  }, [currentGuess.length, isInputDisabled])

  const onDelete = useCallback(() => {
    setCurrentGuess(currGuess => currGuess.slice(0, -1))
  }, [])

  const onEnter = useCallback(() => {
    if (!(currentGuess.length === 5)) {
      setIsNotEnoughLetters(true)
      return setTimeout(() => {
        setIsNotEnoughLetters(false)
      }, 2000)
    }

    if (!isWordInWordList(currentGuess)) {
      setIsWordNotFoundAlertOpen(true)
      return setTimeout(() => {
        setIsWordNotFoundAlertOpen(false)
      }, 2000)
    }

    if (!isInputDisabled && currentGuess.length === 5) {
      setGuesses(g => [...g, currentGuess])
      // reset current guess after append it to guesses
      setCurrentGuess('')
    }
  }, [currentGuess, isInputDisabled])

  const winModalOnShare = useCallback((isShareToClipboard: boolean) => {
    if (isShareToClipboard) {
      setShowCopyToClipboardComplete(true)
      return setTimeout(() => {
        setShowCopyToClipboardComplete(false)
      }, 2000)
    }
  }, [])

  const winModalOffShare = useCallback(() => {
    setIsWinningModalOpen(false)
  }, [])

  return (
    <div className="py-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex w-80 mx-auto items-center">
        <h1 className="text-xl grow font-bold">Not Wordle</h1>
        <InformationCircleIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setIsInfoModalOpen(true)}
        />
        <ChartBarIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setIsStatsModalOpen(true)}
        />
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        guesses={guesses}
      />
      <WinModal
        isOpen={isWinningModalOpen}
        handleClose={() => setIsWinningModalOpen(false)}
        guesses={guesses}
        onShare={winModalOnShare}
        offShare={winModalOffShare}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => setIsInfoModalOpen(false)}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        handleClose={() => setIsStatsModalOpen(false)}
        gameStats={stats}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        handleClose={() => setIsAboutModalOpen(false)}
      />

      <button
        type="button"
        className="mx-auto mt-4 flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 select-none"
        onClick={() => setIsAboutModalOpen(true)}
      >
        About this game
      </button>

      <Alert message="Not enough letters" isOpen={isNotEnoughLetters} />
      <Alert message="Word not found" isOpen={isWordNotFoundAlertOpen} />
      <Alert
        message={`You lost, the word was ${solution}`}
        isOpen={isLosingAlertOpen}
      />
      <Alert
        message="Game copied to clipboard"
        isOpen={showCopyToClipboardComplete}
        variant="success"
      />
    </div>
  )
}

export default App
