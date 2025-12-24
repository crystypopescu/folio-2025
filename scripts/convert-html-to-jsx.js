import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read the original index.html
const htmlPath = join(__dirname, '../sources/index.html')
const html = readFileSync(htmlPath, 'utf-8')

// Extract body content (lines between <body> and </body>)
const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/i)
if (!bodyMatch) {
  console.error('Could not find body tag')
  process.exit(1)
}

let bodyContent = bodyMatch[1]

// Extract only the .game div and its contents
const gameMatch = bodyContent.match(/<div class="game">([\s\S]*?)<\/div>\s*<script/i)
if (!gameMatch) {
  console.error('Could not find .game div')
  process.exit(1)
}

let gameContent = gameMatch[1]

// Convert to JSX
// 1. Replace class= with className=
gameContent = gameContent.replace(/\sclass="/g, ' className="')

// 2. Replace for= with htmlFor=
gameContent = gameContent.replace(/\sfor="/g, ' htmlFor="')

// 3. Fix image paths: src="ui/ to src="/ui/
gameContent = gameContent.replace(/src="ui\//g, 'src="/ui/')

// 4. Fix href paths: href="/ui/ (if any)
gameContent = gameContent.replace(/href="ui\//g, 'href="/ui/')

// 5. Close self-closing tags properly (img, input, br, etc.)
gameContent = gameContent.replace(/<img([^>]*?)>/g, '<img$1 />')
gameContent = gameContent.replace(/<input([^>]*?)>/g, '<input$1 />')
gameContent = gameContent.replace(/<br>/g, '<br />')
gameContent = gameContent.replace(/<meta([^>]*?)>/g, '<meta$1 />')
gameContent = gameContent.replace(/<link([^>]*?)>/g, '<link$1 />')

// 6. Add alt attributes to images that don't have them
gameContent = gameContent.replace(/<img((?![^>]*alt=)[^>]*?)\/>/g, '<img$1 alt="" />')

// 7. Convert HTML comments to JSX comments
gameContent = gameContent.replace(/<!--\s*(.*?)\s*-->/g, '{/* $1 */}')

// Output the result
console.log('Conversion complete!')
console.log('Total characters:', gameContent.length)

// Write to a temporary file
const outputPath = join(__dirname, '../components/GameHTML.jsx.tmp')
const output = `// Auto-generated from sources/index.html
// This file contains the full HTML structure converted to JSX

export function GameHTML() {
  return (
    <div className="game">
${gameContent}
    </div>
  )
}
`

writeFileSync(outputPath, output, 'utf-8')
console.log('Written to:', outputPath)
console.log('\nNext steps:')
console.log('1. Review the file for any conversion errors')
console.log('2. Rename .jsx.tmp to .jsx')
console.log('3. Import into GameClient.js')
