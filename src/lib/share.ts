import { getGuessStatuses } from './statuses'
import { solutionIndex } from './words'

export const shareStatus = async (guesses: string[]): Promise<boolean> => {
  const text = `Not Wordle ${solutionIndex} ${guesses.length}/6\n\n${generateEmojiGrid(guesses)}`;
  if (navigator.share) {
    return navigator.share({ text: text }).then(() => false)
  }
  return navigator.clipboard.writeText(text).then(() => true)
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
