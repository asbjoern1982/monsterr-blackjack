import view from './view'
import html from './client.html'
import './client.css'

let commands = {}
let events = {
  'gamestate': (client, gamestate) => {
    view.initBoard(client.getCanvas(), gamestate.players, gamestate.deckCount)
  },
  'drew': (client, payload) => {
    client.getChat().append(payload.clientId + ' drew ' + payload.card.color + payload.card.rank)
  },
  'stod': (client, clientId) => {
    client.getChat().append(clientId + ' stands')
  },
  'gameover': (client, message) => {
    client.getChat().append(message)
  },
  'playerJoined': (client, payload) => {

  }
}

export default {
  html,
  commands: commands,
  events: events,
  setup: (client) => {
    $('#client-hit').on('click', () => {
      client.send('hit')
    })
    $('#client-stand').on('click', () => {
      client.send('stand')
    })
    window.addEventListener('resize', () => {
      client.getCanvas().clear()
      view.initBoard(client.getCanvas())
    })
    client.send('ready')
  },
  teardown (client) {},

  // Configure options
  options: {
    htmlContainerHeight: 0.3
  }
}
