import express from 'express'
import 'express-async-errors'

import GalaxyInfoWebApi from './api'
import { apiToken } from './middleware/apiToken'
import {GalaxyInfoWebSocketServer} from "./websocket";
import * as http from "node:http";

interface ConstructorArg {
  GalaxyInfo: GalaxyInfo
}

function log (...message: any[]) {
  console.log('[Web]', ...message)
}

export class GalaxyInfoWeb {
  private readonly GalaxyInfo

  constructor ({ GalaxyInfo }: ConstructorArg) {
    this.GalaxyInfo = GalaxyInfo
    void this.init()
  }

  async init () {
    const config = this.GalaxyInfo.config.web

    const app = express()

    app.use((req, _res, next) => {
      req.GalaxyInfo = this.GalaxyInfo
      next()
    })

    app.use(apiToken) // eslint-disable-line @typescript-eslint/no-misused-promises

    app.use('/api', await GalaxyInfoWebApi({ GalaxyInfo: this.GalaxyInfo }))

    app.get('/', (_, res) => res.send('should be frontend'))

    app.use((err: any, _req: express.Request, res: express.Response) => {
      console.error(err)
      res.status(500)
      res.end()
    })

    const server: http.Server = app.listen(config.port, () => {
      log('Listening on', config.port)
    })

    this.GalaxyInfo.webSocketServer = new GalaxyInfoWebSocketServer(server)
  }
}
