import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '@shared/services/global.service';
import { StakingService } from '@shared/services/staking-service';
import { Animations } from '@shared/animations/animations';
import { WalletService } from '@shared/services/wallet.service';
import { ColdStakingService } from '@shared/services/cold-staking-service';

@Component({
  selector: 'app-logout-confirmation',
  templateUrl: './logout-confirmation.component.html',
  styleUrls: ['./logout-confirmation.component.scss'],
  animations: Animations.fadeIn
})
export class LogoutConfirmationComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private stakingService: StakingService,
    private globalService: GlobalService,
    private walletService: WalletService,
    private coldStakingService: ColdStakingService) { }

  public sidechainEnabled: boolean;

  ngOnInit(): void {
    this.sidechainEnabled = this.globalService.getSidechainEnabled();
  }

  public onLogout(): void {
    if (!this.sidechainEnabled) {
      this.stakingService.stopStaking();

    }
    this.activeModal.close();
    this.walletService.clearWalletHistory(0);
    this.coldStakingService.setStakingAccount(null);
    this.router.navigate(['/login']);
  }
}
