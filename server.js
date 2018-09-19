import createServer, { Network } from 'monsterr'
import blackjack from './src/stages/blackjack/server/server'

const stages = [blackjack]

let events = {}
let commands = {}

const monsterr = createServer({
  network: Network.pairs(8),
  events,
  commands,
  stages,
  options: {
    clientPassword: undefined, // can specify client password
    adminPassword: 'sEcr3t' // and admin password
  }
})

monsterr.run()
