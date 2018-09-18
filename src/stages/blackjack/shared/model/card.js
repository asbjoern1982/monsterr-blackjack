import Entity from '../../lib/entity'

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
  }

  getColor () {
    return this.type.substring(1, 2)
  }

  getRank () {
    let rank = this.type.substring(0, 1)
    switch (rank) {
      case 'a':
        return 1
      case 't':
        return 10
      case 'j':
        return 11
      case 'q':
        return 12
      case 'k':
        return 13
      default:
        return rank
    }
  }
}

export default Card
