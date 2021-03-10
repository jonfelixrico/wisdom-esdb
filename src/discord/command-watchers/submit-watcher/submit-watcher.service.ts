import { QuoteInteractorService } from '@/interactors/quote-interactor/quote-interactor.service'
import { PrefixWatcherService } from '@discord/services/prefix-watcher/prefix-watcher.service'
import { Injectable } from '@nestjs/common'
import { matchPrefix } from '@discord/utils/command-utils.util'
import { map, filter } from 'rxjs/operators'
import { Message } from 'discord.js'
import { DISCORD_TAG_REGEXP } from '@discord/utils/discord-utils.util'
import { ReactionWatcherService } from '@discord/services/reaction-watcher/reaction-watcher.service'

const COMMAND_PREFIX = 'submit'

/*
 * The submit command accepts content and user mention as its parameters.
 * There's also an optional param which is the year.
 *
 * I think its possible to combine both of these into one regexp but I'm
 * just too lazy to exert more effort for this.
 */
const REGEXPS = [
  // <content> <userMention> <year>
  /^(.+?)\s+<@!?(\d+)>\s+(\d{4})$/,
  // <content> <userMention>
  /^(.+?)\s+<@!?(\d+)>$/,
]

@Injectable()
export class SubmitWatcherService {
  constructor(
    private watcher: PrefixWatcherService,
    private quoteInteractor: QuoteInteractorService,
    private reactionWatcher: ReactionWatcherService,
  ) {
    this.listenToCommandBus()
  }

  private evaluateAndExtractArgs(command: string) {
    // check if incoming string starts with 'submit'
    const args = matchPrefix(COMMAND_PREFIX, command)
    if (args === false) {
      return false
    }

    // match the rest of the string (w/o 'submit') to see if it conforms to the args syntax
    for (const regexp of REGEXPS) {
      if (regexp.test(args)) {
        return regexp.exec(args).slice(1)
      }
    }

    return false
  }

  /**
   * This is intended to check the message if the provided value in the author part
   * of the syntax is an actual discord mention. The user has to be mentioned via Discord's
   * acutal mention feature and not via explicitly providing a snowflake string.
   * @param author
   * @param message
   */
  private isAuthorMentionedInMessage(author: string, message: Message) {
    return (
      message.mentions.users.has(author) || message.mentions.members.has(author)
    )
  }

  /**
   * The content of a message must be free from discord tags. Some examples of tags
   * are mentions and uses of custom server emojis.
   * @param content
   */
  private isContentFreeOfDiscordTags(content: string) {
    return !DISCORD_TAG_REGEXP.test(content)
  }

  private isSubmissionClean(content: string, author: string, message: Message) {
    return (
      this.isContentFreeOfDiscordTags(content) &&
      this.isAuthorMentionedInMessage(author, message)
    )
  }

  private async handler([params, message]: [string[], Message]) {
    const [content, author, year] = params

    if (!this.isSubmissionClean(content, author, message)) {
      return
    }

    const parsedYear = year && Number(year)
    // years like '0011' are invalid
    if (parsedYear && parsedYear < 1000) {
      // TODO respond with an error maybe?
      return
    }

    // these are ways to let the user know that their command has been acknowledged
    const response = await message.channel.send(
      `${message.author}, we're processing your submission. Please stand by.`,
    )

    try {
      const submitDt = new Date()
      const submitted = await this.quoteInteractor.submitQuote({
        author,
        content,
        year: parsedYear || null,
        submitDt,
        submitBy: message.author.id,

        channel: message.channel.id,
        guild: message.guild.id,
        message: response.id,
      })

      // TODO format this properly
      await response.edit(JSON.stringify(submitted))
      this.reactionWatcher.watch(response, submitted)
    } catch (e) {
      // TODO handle expected and unexpected errors
      await response.edit(
        `${message.author}, something wrong went wrong while processing your submission. Try again later, maybe?`,
      )
    }
  }

  get commandBus$() {
    return this.watcher.commandBus.pipe(
      map((payload) => [
        this.evaluateAndExtractArgs(payload.command),
        payload.message,
      ]),
      filter(([extracted]) => !!extracted),
    )
  }

  private listenToCommandBus() {
    this.commandBus$.subscribe(this.handler.bind(this))
  }
}
