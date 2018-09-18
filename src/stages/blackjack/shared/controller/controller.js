import {sharedInterface as netframe} from '../../lib/netframe'
import Deck from '../model/deck'
import Hand from '../model/hand'

function createDeck (entityId, cards) {
  // Create the deck entity
  let deck = new Deck(entityId, cards)

  // Add entity to map
  netframe.updateEntity(deck.id, deck)

  return deck
}

function createHand (entityId, owner) {
  // Create the deck entity
  let hand = new Hand(entityId, owner)

  // Add entity to map
  netframe.updateEntity(hand.id, hand)

  return hand
}

export default {
  createDeck: createDeck,
  createHand: createHand
}
