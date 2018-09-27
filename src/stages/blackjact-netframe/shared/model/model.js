import Entity from '../../lib/entity'

class Hand extends Entity {
  constructor (entityId, owner) {
    super(entityId, owner)
    this.cards = []
    this.stopped = false
  }

  addCard (card) {
    this.cards.push(card)
  }

  reset () {
    this.cards = []
    this.stopped = false
  }

  getPoints () {
    let points = 0
    for (let c in this.cards) {
      points += Math.floor(this.cards[c].rank)
    }
    return points
  }

  getCards () {
    return this.cards
  }

  stop () {
    this.stopped = true
  }

  isStopped () {
    return this.stopped
  }
}

class Deck extends Entity {
  constructor (entityId, cards) {
    super(entityId, null)
    this.cards = cards
    this.drawnCards = []
  }

  getCount () {
    return this.cards.length
  }

  getPoints () {
    let points = 0
    for (let c in this.drawnCards) {
      points += Math.floor(this.drawnCards[c].rank)
    }
    return points
  }

  shuffle () {
    this.cards = this.cards
      .map((a) => ({sort: Math.random(), value: a}))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
  }

  drawCard () {
    return this.cards.pop()
  }
}

/*
 * Card types notation:
 * two letters, first is the rank, the second is the color.
 * rank: [a: ace, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, t: 10: j: jack, q: queen, k: king]
 * colors: [c: clubs, d: diamonds, h: hearts, s: spades]
 * so the king od hearts would be "kh", 6 of clubs would be "6c" and ace of
 * spades would be "as"
 */

class Card extends Entity {
  constructor (entityId, type) {
    super(entityId, null)
    this.type = type
    this.color = type.substring(1, 2)

    let rank = this.type.substring(0, 1)
    switch (rank) {
      case 'a':
        this.rank = 1
        break
      case 't':
        this.rank = 10
        break
      case 'j':
        this.rank = 11
        break
      case 'q':
        this.rank = 12
        break
      case 'k':
        this.rank = 13
        break
      default:
        this.rank = rank
    }
  }
}

const IModel = {
  Card: Card,
  Deck: Deck,
  Hand: Hand
}

export default IModel
