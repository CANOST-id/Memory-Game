import { defineConfig } from 'vite'

export default defineConfig({
  
  base: '/memory/',
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        settings: 'settings.html',
        game: 'game.html',
        gameOver: 'game-over.html',
        gameEnd: 'game-end.html'
      }
    }
  }
})