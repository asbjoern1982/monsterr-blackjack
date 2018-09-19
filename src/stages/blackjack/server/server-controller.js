import model from '../shared/model/model'
import modelController from '../shared/controller/controller'
import {serverSharedInterface as netframe} from '../lib/netframe'

let deck

// ---------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------

let init = (serverInstance) => {
  // Setup and initiate NetFrame
  netframe.shouldLog(true) // set logging
  netframe.addUpdateCallback(update) // add update callback
  netframe.addClientConnectedCallback(clientConnected) // add client connected callback
  netframe.init(serverInstance) // set server reference
  netframe.startLoop(10) // start server update with X ms interval - stop again with stopLoop()

  // server generates deck on startup
  deck = createDecks(1)
}

// Gets called from netframe after each update
let update = () => {}

let clientConnected = (client, networkIdentity) => {
  netframe.log('clientConnected() called on server-controller...')

  // Create player
  createPlayer(client, networkIdentity.name)

  // TODO start the game when the first player joins
  if (netframe.getNetworkIdentities().length >= 1) {
    // spawnBox()
  }
}

let createPlayer = (owner, name) => {
  netframe.log('ash: server-controler>createPlayer')
  let entityId = netframe.createNewEntityId()
  modelController.createHand(entityId, owner)
}

// ---------------------------------------------------------------
// Controller functions
// ---------------------------------------------------------------

let createDecks = (numberOfSets) => {
  netframe.log('ash: server-controler>createDecks')
  let cards = []
  let ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k']
  let colors = ['c', 'd', 'h', 's']
  for (let d = 0; d < numberOfSets; d++) {
    for (let r in ranks) {
      for (let c in colors) {
        let entityId = netframe.createNewEntityId()
        let card = modelController.createCard(entityId, ranks[r] + colors[c])
        cards.push(card) // new model.Card(entityId, ranks[r] + colors[c]))
      }
    }
  }

  let entityId = netframe.createNewEntityId()
  let deck = modelController.createDeck(entityId, cards)
  deck.shuffle()

  // TODO sync the clients?
  return deck
}

let cmdOneMore = (entity) => {
  netframe.log('ash: client wants one more card')
}

let cmdStop = (entity) => {
  netframe.log('ash: client asked to stop')
  entity.stop()
}

// ---------------------------------------------------------------

const commands = {
  'cmdStop': cmdStop,
  'cmdOneMore': cmdOneMore
}

const api = {
  clientConnected: clientConnected,
  init: init,
  commands: commands
}

export default api
