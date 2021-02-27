import { Module } from '@nestjs/common'
import { SubmitInteractorService } from './submit-interactor/submit-interactor.service'
import { ReceiveInteractorService } from './receive-interactor/receive-interactor.service'
import { ApproveInteractorService } from './approve-interactor/approve-interactor.service'

@Module({
  providers: [
    SubmitInteractorService,
    ReceiveInteractorService,
    ApproveInteractorService,
  ],
})
export class InteractorsModule {}
