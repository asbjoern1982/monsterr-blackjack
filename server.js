import createServer, { Network, Events } from 'monsterr'
import blackjack from './src/stages/blackjack/server/server'

const stages = [blackjack]

let events = {
  [Events.CLIENT_CONNECTED] (server, clientId) {
    server.start()
  }
}
let commands = {}

const monsterr = createServer({
  network: Network.clique(4),
  events,
  commands,
  stages,
  options: {
    clientPassword: undefined, // can specify client password
    adminPassword: 'sEcr3t' // and admin password
  }
})

monsterr.run()
