import clientController, {listeners} from './client-controller'
import {getCombinedClientEvents} from '../lib/netframe'

// You can import html and css from anywhere.
import html from './client.html'
// css is immediately applied on import.
import './client.css'

export default {
  html,
  commands: {
    finish (client) {
      client.stageFinished() // <== this is how a client reports finished
      return false // <== false tells client not to pass command on to server
    }
  },
  events: getCombinedClientEvents(),
  setup: (client) => {
    clientController.init(client)

    $('#client-one-more').on('click', listeners['oneMoreListener'])
    $('#client-stop').on('click', listeners['stopListener'])
  },
  teardown (client) {},

  // Configure options
  options: {
    htmlContainerHeight: 0.3
  }
}
