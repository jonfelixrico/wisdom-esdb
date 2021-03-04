import { EventStoreDBClient } from '@eventstore/db-client'

import { Provider } from '@nestjs/common'

const { ESDB_CONNECTION_STRING } = process.env

export const EventStoreClient: Provider = {
  provide: EventStoreDBClient,
  useValue: EventStoreDBClient.connectionString(ESDB_CONNECTION_STRING),
}
