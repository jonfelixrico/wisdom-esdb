import { Message } from 'discord.js'
import { ICommandLocation } from '@models/command-location.interface'

export function extractCommandLocation(message: Message): ICommandLocation {
  return {
    message: message.id,
    channel: message.channel.id,
    guild: message.guild.id,
  }
}
