import { Module } from '@nestjs/common'
import { SubmitInteractorService } from './services/submit-interactor/submit-interactor.service'
import { ReceiveInteractorService } from './services/receive-interactor/receive-interactor.service'
import { ApproveInteractorService } from './services/approve-interactor/approve-interactor.service'

@Module({
  providers: [
    SubmitInteractorService,
    ReceiveInteractorService,
    ApproveInteractorService,
  ],
})
export class InteractorsModule {}
