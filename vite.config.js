import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    target: 'esnext',
    rollupOptions: {
      input: {
        main: 'index.html',
        game: 'drinking-game.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  plugins: [
    {
      name: 'copy-static-assets',
      writeBundle() {
        // 确保目标目录存在
        const imagesDir = resolve('./dist/images')
        const coversDir = resolve('./dist/images/covers')
        
        if (!existsSync(imagesDir)) {
          mkdirSync(imagesDir, { recursive: true })
        }
        if (!existsSync(coversDir)) {
          mkdirSync(coversDir, { recursive: true })
        }
        
        // 复制 logo 文件
        copyFileSync(resolve('./images/logo.png'), resolve('./dist/images/logo.png'))
        
        // 复制所有封面图片
        const coverImages = [
          'battle-royale.png',
          'kiss-marks.png', 
          'love-battle.png',
          'man-di-piao-ling.png',
          'moon-night.png',
          'party-psychology.png',
          'poker.png',
          'wisdom.png'
        ]
        
        coverImages.forEach(filename => {
          copyFileSync(
            resolve(`./images/covers/${filename}`),
            resolve(`./dist/images/covers/${filename}`)
          )
        })
        
        console.log('✅ Static assets copied successfully!')
      }
    }
  ]
})