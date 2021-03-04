import { Injectable } from '@nestjs/common'
import { PrefixRepository } from '@repositories/models/prefix-repository.abstract'

@Injectable()
export class PrefixRepositoryService extends PrefixRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPrefix(guildId: string): Promise<string> {
    return '!wisdom'
  }
}
