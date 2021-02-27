import { Provider } from '@nestjs/common'
import { Client } from 'discord.js'

const { DISCORD_TOKEN } = process.env

export const DiscordClientProvider = {
  provide: Client,
  useFactory: () =>
    new Promise((resolve, reject) => {
      const client = new Client()
      try {
        client.login(DISCORD_TOKEN)
        client.on('ready', () => {
          resolve(client)
        })
      } catch (e) {
        reject(e)
      }
    }),
} as Provider
