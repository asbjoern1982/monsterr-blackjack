import model from '../shared/model/model'
import view from './view'
import {clientSharedInterface as netframe} from '../lib/netframe'

const rpcs = {

}

let controlledEntity

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
      netframe.log('ash> creating hand')
      if (entity.owner === netframe.getClientId()) {
        netframe.log('Setting rpcSetControlledEntity...')
        controlledEntity = entity.id
      }
      view.addHand(entity, entity.owner)
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
  if (entity instanceof model.Deck) {
    view.updateDeck()
  } else if (entity instanceof model.Hand) {
    view.updatehand(entity)
  }
}

// ---------------------------------------------------------------
// listeners
// ---------------------------------------------------------------

let oneMoreListener = () => {
  netframe.log('ash: client-controller> one more clicked')
  if (controlledEntity) {
    let hand = netframe.getEntity(controlledEntity)
    if (hand.getPoints() < 21) {
      // TODO ask the server to get one more card
      let data = {command: 'oneMore', entityId: controlledEntity, params: []}
      netframe.makeCmd(data)
    }
  }
}

let stopListener = () => {
  netframe.log('ash: client-controller> stop clicked')
  // TODO ask the server to stop my turn
  let data = {command: 'cmdStop', entityId: controlledEntity, params: []}
  netframe.log('ash: data ' + controlledEntity)
  netframe.makeCmd(data)
}

// ---------------------------------------------------------------

export let listeners = {
  oneMoreListener: oneMoreListener,
  stopListener: stopListener
}

export default {
  init: init,
  rpcs: rpcs
}
