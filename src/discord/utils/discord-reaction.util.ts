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

export type ReactionPair = [IEmojiDetails, number]
type ReactionPairMap = { [emojiId: string]: ReactionPair }

function getKey({ name, identifier }: IEmojiDetails) {
  return [name, identifier].join('/')
}

function extractEmojiDetails({ id, name, identifier }: Emoji): IEmojiDetails {
  return { id, name, identifier }
}

function convertToArray(map: ReactionPairMap): ReactionPair[] {
  return chain(map)
    .values()
    .sortBy(([emoji]) => getKey(emoji))
    .map((pair) => clone(pair))
    .value()
}

function updateCountFactory(
  subject: BehaviorSubject<ReactionPair[]>,
  map: ReactionPairMap,
) {
  return (emoji: Emoji, valueChange = 1) => {
    const key = getKey(emoji)

    if (map[key] === undefined) {
      map[key] = [extractEmojiDetails(emoji), 0]
    }

    map[key][1] += valueChange

    subject.next(convertToArray(map))
  }
}

function getInitialReactions(
  message: Message,
  filterFn: ReactionFilter,
): ReactionPairMap {
  const expandedReactions = message.reactions.cache
    .array()
    .map<[MessageReaction, User][]>((reaction) =>
      reaction.users.cache.array().map((user) => [reaction, user]),
    )
    .flat()
    .filter(([reaction, user]) => filterFn(reaction, user))

  return chain(expandedReactions)
    .groupBy(([reaction]) => getKey(reaction.emoji))
    .mapValues<ReactionPair>((arrOfExpandedReactions) => {
      const [reaction] = arrOfExpandedReactions[0]
      return [
        extractEmojiDetails(reaction.emoji),
        arrOfExpandedReactions.length,
      ]
    })
    .value()
}

export function watchReactions(
  message: Message,
  filterFn: ReactionFilter = () => true,
) {
  const reactionMap = getInitialReactions(message, filterFn)

  const subject = new BehaviorSubject<ReactionPair[]>(
    convertToArray(reactionMap),
  )

  const updateCount = updateCountFactory(subject, reactionMap)

  const collector = message.createReactionCollector(filterFn)

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
