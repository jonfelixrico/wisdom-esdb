import { Message, User, MessageReaction, Emoji, Snowflake } from 'discord.js'
import { chain, clone } from 'lodash'
import { BehaviorSubject } from 'rxjs'

export type ReactionFilter = (reaction: MessageReaction, user: User) => boolean
export type ReactionCountMap = { [emojiId: string]: number }

export interface IEmojiDetails {
  id?: Snowflake
  name: string
  identifier: string
}

export interface IReaction {
  emoji: IEmojiDetails
  count: number
}

interface IReactionMap {
  [key: string]: IReaction
}

function getKey({ name, identifier }: IEmojiDetails) {
  return [name, identifier].join('/')
}

function extractEmojiDetails({ id, name, identifier }: Emoji): IEmojiDetails {
  return { id, name, identifier }
}

function convertToArray(map: IReactionMap): IReaction[] {
  return chain(map)
    .values()
    .sortBy(({ emoji }) => getKey(emoji))
    .map((reaction) => clone(reaction))
    .value()
}

function updateCountFactory(
  subject: BehaviorSubject<IReaction[]>,
  map: IReactionMap,
) {
  return (emoji: Emoji, valueChange = 1) => {
    const key = getKey(emoji)

    if (map[key] === undefined) {
      map[key] = {
        emoji: extractEmojiDetails(emoji),
        count: 0,
      }
    }

    map[key].count += valueChange

    subject.next(convertToArray(map))
  }
}

function getInitialReactions(
  message: Message,
  filterFn: ReactionFilter,
): IReactionMap {
  const expandedReactions = message.reactions.cache
    .array()
    .map<[MessageReaction, User][]>((reaction) =>
      reaction.users.cache.array().map((user) => [reaction, user]),
    )
    .flat()
    .filter(([reaction, user]) => filterFn(reaction, user))

  return chain(expandedReactions)
    .groupBy(([reaction]) => getKey(reaction.emoji))
    .mapValues<IReaction>((arrOfExpandedReactions) => {
      const [reaction] = arrOfExpandedReactions[0]
      return {
        emoji: extractEmojiDetails(reaction.emoji),
        count: arrOfExpandedReactions.length,
      }
    })
    .value()
}

export function watchReactions(
  message: Message,
  filterFn: ReactionFilter = () => true,
) {
  const reactionMap = getInitialReactions(message, filterFn)

  const subject = new BehaviorSubject<IReaction[]>(convertToArray(reactionMap))

  const updateCount = updateCountFactory(subject, reactionMap)

  const collector = message.createReactionCollector(filterFn, { dispose: true })

  collector.on('collect', ({ emoji }) => {
    updateCount(emoji)
  })

  collector.on('remove', ({ emoji }) => {
    updateCount(emoji, -1)
  })

  collector.on('end', () => {
    subject.complete()
  })

  return {
    observable: subject.asObservable(),
    stop: () => collector.stop(),
  }
}
