import Entity from '../../lib/entity'

class Hand extends Entity {
  constructor (entityId, owner) {
    super(entityId, owner)
    this.cards = []
  }

  addCard (card) {
    this.cards.push(card)
  }

  clearCards () {
    this.cards = []
  }

  getPoints () {
    let points = 0
    for (let c in this.cards) {
      points += this.cards[c].getRank()
    }
    return points
  }

  getCards () {
    return this.cards
  }
}

export default Hand
