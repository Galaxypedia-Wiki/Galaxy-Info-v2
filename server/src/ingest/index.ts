import { Client } from 'discord.js'

import { readdir } from 'fs/promises'
import path from 'path'
import { AwaitableCollection } from '../util/AwaitableCollection'
import type { IngestService, IngestServiceArg } from './service'

type ConstructorArg = {
  GalaxyInfo: GalaxyInfo
}

function log (...message: any[]) {
  console.log('[Ingest]', ...message)
}

async function getServices(): Promise<(new(arg: IngestServiceArg) => IngestService)[]> {
  const servicesDir = path.join(__dirname, 'services')
  const serviceFilenames = (await readdir(servicesDir))
    .filter(filename => filename.endsWith('.js'))
  return Promise.all(serviceFilenames.map(filename => require(path.join(servicesDir, filename)).default))
}

export class IngestServices {
  private GalaxyInfo
  public services: AwaitableCollection<string, IngestService>

  constructor ({ GalaxyInfo }: ConstructorArg) {
    this.GalaxyInfo = GalaxyInfo
    this.services = new AwaitableCollection()
    this.init()
  }

  async init () {
    if (!this.GalaxyInfo.config.ingest?.token) return

    const client = new Client({
      intents: [
        'GUILD_MESSAGES',
        'GUILD_MEMBERS'
      ]
    })

    client.once('ready', async () => {
      if (!client.user) return log('Error: client.user is falsy')
      log(`Logged in as ${client.user.tag}!`)

      // this should be genericized to allow easier maintenance
      client.on('messageCreate', async (message) => {
        if (message.guildId !== '204965774618656769') return
        if (!message.content.toLowerCase().includes('yname') && !message.content.includes('993019299025399898')) return
        try { await message.react('862868503006675004') } catch {}
      })

      const services = await getServices()
      for (const serviceConstructor of services) {
        const service = new serviceConstructor({
          GalaxyInfo: this.GalaxyInfo,
          client,
          log: (...message) => log(`[${serviceConstructor.name}]`, ...message)
        })
        this.services.set(serviceConstructor.name, service)
      }

      log('Instantiated all ingest subservices')
    })

    client.login(this.GalaxyInfo.config.ingest.token)
  }
}
