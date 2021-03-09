import { Message, User, MessageReaction } from 'discord.js'
import { chain, clone } from 'lodash'
import { BehaviorSubject } from 'rxjs'

export type ReactionFilter = (reaction: MessageReaction, user: User) => boolean
export type ReactionCountMap = { [emojiId: string]: number }

function updateCountFactory(subject: BehaviorSubject<ReactionCountMap>) {
  return (emojiId: string, valueChange = 1) => {
    const valueClone = clone(subject.value)

    if (valueClone[emojiId] === undefined) {
      valueClone[emojiId] = 0
    }

    valueClone[emojiId] += valueChange

    subject.next(valueClone)
  }
}

function getInitialReactionCountMap(
  message: Message,
  filterFn: ReactionFilter,
): ReactionCountMap {
  const expandedReactions = message.reactions.cache
    .array()
    .map<[MessageReaction, User][]>((reaction) =>
      reaction.users.cache.array().map((user) => [reaction, user]),
    )
    .flat()
    .filter(([reaction, user]) => filterFn(reaction, user))

  return chain(expandedReactions)
    .groupBy(([reaction]) => reaction.emoji.id)
    .mapValues((arrOfExpandedReactions) => arrOfExpandedReactions.length)
    .value()
}

export function watchReactions(
  message: Message,
  filterFn: ReactionFilter = () => true,
) {
  const subject = new BehaviorSubject<ReactionCountMap>(
    getInitialReactionCountMap(message, filterFn),
  )

  const updateCount = updateCountFactory(subject)

  const collector = message.createReactionCollector(filterFn)

  collector.on('collect', ({ emoji }) => {
    updateCount(emoji.id)
  })

  collector.on('remove', ({ emoji }) => {
    updateCount(emoji.id, -1)
  })

  collector.on('end', () => {
    subject.complete()
  })

  return {
    observable: subject.asObservable(),
    stop: () => collector.stop(),
  }
}
