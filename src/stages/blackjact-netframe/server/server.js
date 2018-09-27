import {getCombinedServerEvents, getCombinedServerCommands} from '../lib/netframe'
import serverController from './server-controller'

let commands = {}
let events = {}

export default {
  commands: getCombinedServerCommands(commands),
  events: getCombinedServerEvents(events),
  setup: (server) => {
    serverController.init(server)
  },
  teardown: (server) => {
    console.log('CLEANUP SERVER AFTER STAGE',
      server.getCurrentStage())
  },
  options: {}
}
