import { ICommandLocation } from '@models/command-location.interface'

export function generateId({ guild, channel, message }: ICommandLocation) {
  return [guild, channel, message].join('/')
}
