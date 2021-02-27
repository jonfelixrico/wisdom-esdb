import { QuoteInteractorService } from '@/interactors/quote-interactor/quote-interactor.service'
import { PrefixWatcherService } from '@discord/services/prefix-watcher/prefix-watcher.service'
import { Injectable } from '@nestjs/common'
import { matchPrefix } from '@discord/utils/command-utils.util'
import { map, filter } from 'rxjs/operators'
import { Message } from 'discord.js'
import { extractCommandLocation } from '@discord/utils/discord-utils.util'

const COMMAND_PREFIX = 'submit'
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
  ) {
    this.onInit()
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

  get commandCalls$() {
    return this.watcher.commandBus.pipe(
      map((payload) => [
        this.evaluateAndExtractArgs(payload.command),
        payload.message,
      ]),
      filter(([extracted]) => !!extracted),
    )
  }

  private checkIfClean(content: string, author: string, message: Message) {
    // double check to see if the extracted author is indeed a mention and not just some author-ish literal
    const isAuthorMentioned =
      message.mentions.users.has(author) || message.mentions.members.has(author)
    const mentionRegexp = /<@!?(\d+)>/g

    // we're not allowing any mentions inside the content body.
    let mentionsInContent = 0
    while (mentionRegexp.exec(content)) {
      mentionsInContent++
    }

    return isAuthorMentioned && mentionsInContent === 0
  }

  private async handler([params, message]: [string[], Message]) {
    const [content, author, year] = params

    if (!this.checkIfClean(content, author, message)) {
      return
    }

    const parsedYear = Number(year)
    // avoid years like '0011'
    if (parsedYear < 1000) {
      return
    }

    const meta = extractCommandLocation(message)

    await this.quoteInteractor.submitQuote({
      author,
      content,
      year: parsedYear,
      submitDt: new Date(),
      submitBy: message.author.id,
      ...meta,
    })
  }

  private onInit() {
    this.watcher.commandBus.subscribe(this.handler.bind(this))
  }
}
