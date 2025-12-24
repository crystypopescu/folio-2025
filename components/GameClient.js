'use client'

import { useEffect, useRef } from 'react'
import { GameHTML } from './GameHTML'

export default function GameClient() {
  const gameInitialized = useRef(false)
  const domReady = useRef(false)

  useEffect(() => {
    // Prevent double initialization in React strict mode
    if (gameInitialized.current) return

    // Wait for DOM to be fully mounted
    const checkDOMReady = () => {
      const gameElement = document.querySelector('.game')
      const canvasElement = document.querySelector('.js-canvas')
      const notificationsElement = document.querySelector('.js-notifications')
      const menuElement = document.querySelector('.js-menu')
      const modalsElement = document.querySelector('.js-modals')

      if (gameElement && canvasElement && notificationsElement && menuElement && modalsElement) {
        domReady.current = true
        return true
      }
      return false
    }

    // Retry DOM check with small delay
    const initGame = () => {
      if (!checkDOMReady()) {
        setTimeout(initGame, 50)
        return
      }

      if (gameInitialized.current) return
      gameInitialized.current = true

      // Dynamic import to avoid SSR issues
      Promise.all([
        import('@/lib/threejs-override'),
        import('@/lib/game/Game'),
        import('@/lib/data/consoleLog'),
      ])
        .then(([_, { Game }, { default: consoleLog }]) => {
          console.log(...consoleLog)

          if (process.env.NEXT_PUBLIC_GAME_PUBLIC) {
            window.game = new Game()
          } else {
            new Game()
          }
        })
        .catch((error) => {
          console.error('Failed to initialize game:', error)
        })
    }

    initGame()
  }, [])

  return <GameHTML />
}
