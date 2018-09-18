import clientController from './client-controller'

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
  events: {},
  setup: (client) => {
    clientController.init(client)
  },
  teardown (client) {},

  // Configure options
  options: {
    htmlContainerHeight: 0.3
  }
}
