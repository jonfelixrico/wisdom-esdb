import { IReceiveBody, IReceive } from '@models/receive.interface'

export abstract class ReceiveRepository {
  abstract createReceive(quoteId: string, info: IReceiveBody): Promise<IReceive>
}
