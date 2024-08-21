import { WebSocket, WebSocketServer } from 'ws'
import type { Server } from 'node:http'

export class GalaxyInfoWebSocketServer {
  private readonly websocketServer: any

  constructor (httpServer: Server) {
    this.websocketServer = new WebSocketServer({ noServer: true })

    httpServer.on('upgrade', (request, socket, head) => {
      this.websocketServer.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        this.websocketServer.emit('connection', ws, request)
      })
    })
  }

  /*
   * Broadcast a message to all connected clients
   */
  broadcast (message: string) {
    this.websocketServer.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)

        let attempts = 0
        const interval = setInterval(() => {
          if (attempts >= 3) {
            clearInterval(interval)
            client.terminate()
          } else {
            client.send(message)
            attempts++
          }
        }, 60000)
      }
    })
  }
}
