import Entity from '../../lib/entity'

class Deck extends Entity {
  constructor (entityId, cards) {
    super(entityId, null)
    this.cards = cards
  }

  setCards (cards) {
    this.cards = cards
  }

  getCount () {
    return this.cards.count
  }

  shuffle () {
    this.cards = this.cards
      .map((a) => ({sort: Math.random(), value: a}))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
  }
}

export default Deck
