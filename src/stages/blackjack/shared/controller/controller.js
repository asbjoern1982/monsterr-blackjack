import {sharedInterface as netframe} from '../../lib/netframe'
import model from '../model/model'

let networkIdentityColors = ['red', 'yellow', 'white']

let createDeck = (entityId, cards) => {
  // Create the deck entity
  let deck = new model.Deck(entityId, cards)

  // Add entity to map
  netframe.updateEntity(deck.id, deck)

  return deck
}

let createHand = (entityId, owner) => {
  // Create the deck entity
  let hand = new model.Hand(entityId, owner)

  // Add entity to map
  netframe.updateEntity(hand.id, hand)

  return hand
}

let createCard = (entityId, type) => {
  let card = new model.Card(entityId, type)
  netframe.updateEntity(card.id, card)
  return card
}

let getNetworkIdentityColors = () => {
  return networkIdentityColors
}

export default {
  createDeck: createDeck,
  createHand: createHand,
  createCard: createCard,
  getNetworkIdentityColors: getNetworkIdentityColors
}
