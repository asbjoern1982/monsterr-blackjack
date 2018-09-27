import {Events} from 'monsterr'
let numberOfSets = 1
let cards = []
let clients = {}

let commands = {}
let events = {
  [Events.CLIENT_CONNECTED]: (server, clientId) => {
    clients[clientId] = {
      stand: false
    }
    setTimeout(() => {
      let stageNo = server.getCurrentStage().number
      server.send(Events.START_STAGE, stageNo).toClient(clientId)
      // inform everyone else that this player has joined
      server.send('playerJoined', clientId).toClient(...Object.keys(clients).filter(client => client !== clientId))
      // TODO send deckcount and other players to the newly joined player?
    }, 1000)
  },
  'ready': (server, clientId) => {
    let gamestate = {
      players: Object.keys(clients),
      cardsInUse: cards.filter(card => card.owner !== null && card.owner !== 'used' && card.owner !== 'dealer'),
      deckCount: cards.filter(card => card.owner === null).reduce((sum, card) => sum + 1, 0)
    }
    server.send('gamestate', gamestate).toClient(clientId)
  },
  'hit': (server, clientId) => {
    if (clients[clientId].stand) return

    // find an unowned card and own it
    let card = cards.find(card => card.owner === null)
    if (!card) { console.log('no more cards!'); return }
    card.owner = clientId

    // calculate current points, if over 21, stand
    let points = cards.filter(card => card.owner === clientId).reduce((sum, card) => sum + card.value, 0)
    if (points > 21) clients[clientId].stand = true

    let payload = { clientId: clientId, card: card, sum: points }
    server.send('drew', payload).toAll()
    if (isRoundOver()) dealersTurn(server)
  },
  'stand': (server, clientId) => {
    if (clients[clientId].stand) return

    clients[clientId].stand = true
    if (isRoundOver()) dealersTurn(server)
    server.send('stod', clientId).toAll()
  }
}

export default {
  commands: commands,
  events: events,
  setup: (server) => {
    cards = createDeck(numberOfSets)
    server.getPlayers().forEach(clientId => { clients[clientId] = {stand: false} })
  },
  teardown: (server) => {},
  options: {}
}

let isRoundOver = () => {
  return Object.values(clients).filter(obj => !obj.stand).length === 0
}

let dealersTurn = (server) => {
  // find the max valid points and all hands that has that
  let handsWithMaxPoints = Object.keys(clients).map(client => {
    return {
      client: client,
      points: cards.filter(card => card.owner === client).reduce((sum, card) => sum + card.value, 0)}
  }).filter(hand => hand.points > 0 && hand.points <= 21)
    .reduce((acc, hand) => {
      return (acc.length === 0 || acc[0].points < hand.points)
        ? [hand] : (acc[0].points === hand.points) ? acc.push(hand) : acc
    }, [])

  // let the dealer draw
  let dealersPoints = 0
  if (handsWithMaxPoints.length > 0) {
    while (dealersPoints < handsWithMaxPoints[0].points) {
      let card = cards.find(card => card.owner === null)
      if (!card) return // no more cards
      card.owner = 'dealer'
      dealersPoints += card.value
    }
  }
  console.log('dealer: ' + dealersPoints)

  // who won?
  if (dealersPoints > 21) {
    // player won
    console.log('player won')
    let winners = '[' + handsWithMaxPoints.map(hand => hand.client).join() + ']'
    server.send('gameover', winners + 'won with ' + handsWithMaxPoints[0].points + ' points').toAll()
  } else {
    // dealer won
    console.log('dealer won')
    server.send('gameover', 'dealer won with ' + dealersPoints + ' points').toAll()
  }

  // reset
  cards.filter(card => card.owner !== null).forEach(card => { card.owner = 'used' })
  Object.keys(clients).forEach(clientId => { clients[clientId].stand = false })
}

let createDeck = (numberOfSets) => {
  let deck = []
  let ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k']
  let colors = ['c', 'd', 'h', 's']
  for (let d = 0; d < numberOfSets; d++) {
    for (let r in ranks) {
      for (let c in colors) {
        let card = {
          rank: ranks[r],
          color: colors[c],
          value: Math.floor(r) + 1,
          owner: null
        }
        deck.push(card)
      }
    }
  }
  let shuffledDeck = deck
    .map((a) => ({sort: Math.random(), value: a}))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)
  return shuffledDeck
}
