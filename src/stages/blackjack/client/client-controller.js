import Deck from '../shared/model/deck'
import Hand from '../shared/model/hand'
import view from './view'
import {clientSharedInterface as netframe} from '../lib/netframe'

const rpcs = {

}

let myHandId

// ---------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------
let init = (client) => {
  netframe.shouldLog(true)
  netframe.addCreateEntityCallback(createEntity)
  netframe.addUpdateEntityCallback(updateEntity)
  netframe.addEndStageCallback(endStage)
  netframe.init(client)

  view.init()

  netframe.getClient().send('ClientConnected')
}

let endStage = () => {
  view.reset()
  netframe.removeCreateEntityCallback(createEntity)
  netframe.removeUpdateEntityCallback(updateEntity)
  netframe.removeEndStageCallback(endStage)
  netframe.reset()
}

let createEntity = (entity) => {
  netframe.log('createEntity was called on client-controller with entity: ' + JSON.stringify(entity))

  switch (netframe.getClassNameOfEntity(entity)) {
    case 'Hand':
      if (entity.owner === netframe.getClientId()) {
        netframe.log('Setting rpcSetControlledEntity...')
        myHandId = entity.id
      }
      view.addHand(entity)
      break
    case 'Deck':
      view.setDeck(entity)
      break
    default:
      netframe.log('client-controller.js> createEntity called with an unknown class')
      break
  }
}

function updateEntity (entity) {
  if (entity instanceof Deck) {
    view.updateDeck()
  } else if (entity instanceof Hand) {
    view.updatehand(entity)
  }
}

// ---------------------------------------------------------------
// listeners
// ---------------------------------------------------------------

let oneMoreListener = () => {
  if (myHandId) {
    let hand = netframe.getEntity(myHandId)
    if (hand.getPoints() < 21) {
      // TODO ask the server to get one more card
    }
  }
}

let stopListener = () => {
  // TODO ask the server to stop my turn
}

// ---------------------------------------------------------------

export let listeners = {
  oneMoreListener,
  stopListener
}

export default {
  init: init,
  rpcs: rpcs
}
