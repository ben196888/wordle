import { getGuessStatuses } from './statuses'
import { solutionIndex } from './words'

export const shareStatus = (guesses: string[]) => {
  navigator.clipboard.writeText(
    `Not Wordle ${solutionIndex} ${guesses.length}/6\n\n${generateEmojiGrid(guesses)}`
  )
}

export const generateEmojiGrid = (guesses: string[]) => {
  return guesses
    .map((guess) => {
      const status = getGuessStatuses(guess)
      return status.map(condition => {
        switch (condition) {
          case 'correct':
            return '🟩'
          case 'present':
            return '🟨'
          default:
            return '⬜'
        }
      }).join('');
    })
    .join('\n')
}
