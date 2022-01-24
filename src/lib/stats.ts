import {
  GameStats,
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'

/**
 *
 * @param gameStats
 * @param count winning game sends the guesses times from 1 - 6, losing game sends -1
 * @returns
 */
export const addStatsForCompletedGame = (
  gameStats: GameStats,
  count: number
) => {
  // Count is number of incorrect guesses before end.
  const stats = { ...gameStats }

  stats.totalGames += 1

  if (count < 0) {
    // A fail situation
    stats.currentStreak = 0
    stats.gamesFailed += 1
  } else {
    // reindex from 1 to 6 to 0 to 5
    stats.winDistribution[count - 1] += 1
    stats.currentStreak += 1

    if (stats.bestStreak < stats.currentStreak) {
      stats.bestStreak = stats.currentStreak
    }
  }

  stats.successRate = getSuccessRate(stats)

  saveStatsToLocalStorage(stats)
  return stats
}

const defaultStats: GameStats = {
  winDistribution: [0, 0, 0, 0, 0, 0],
  gamesFailed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  successRate: 0,
}

export const loadStats = () => {
  return loadStatsFromLocalStorage() || defaultStats
}

const getSuccessRate = (gameStats: GameStats) => {
  const { totalGames, gamesFailed } = gameStats

  return Math.round(
    (100 * (totalGames - gamesFailed)) / Math.max(totalGames, 1)
  )
}
