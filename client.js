import createClient from 'monsterr'
import blackjack from './src/stages/blackjack/client/client'

const stages = [
  blackjack
]

let options = {
  canvasBackgroundColor: 'blue',
  htmlContainerHeight: 0 // Hide html
}

let events = {}
let commands = {}

createClient({
  events,
  commands,
  options,
  stages
})
