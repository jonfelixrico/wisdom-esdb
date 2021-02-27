import { IReceiveBody, IReceivedQuote } from '@models/received-quote.interface'

export abstract class ReceiveRepository {
  abstract createReceive(
    quoteId: string,
    info: IReceiveBody,
  ): Promise<IReceivedQuote>
}
