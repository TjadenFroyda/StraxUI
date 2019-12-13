import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { WalletBalance } from '@shared/services/interfaces/api.i';
import { WalletService } from '@shared/services/wallet.service';
import { StakingService } from '@shared/services/staking-service';
import { GlobalService } from '@shared/services/global.service';
import { SnackbarService } from 'ngx-snackbar';

@Component({
    selector: 'app-staking-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css']
})
export class ColdStakingWalletComponent implements OnInit {

    private _hotWallet = false;
    private _balance = 0;
    private _amount = 0;
    public wallet: Observable<WalletBalance>;
    public stakingForm: FormGroup;
    balanceFormatted = '';
    amountFormatted = '';
    description = '';

    constructor(private fb: FormBuilder, public walletService: WalletService, public stakingService: StakingService, public globalService: GlobalService, public snackbarService: SnackbarService) {}

    @Output() onGetFirstUnusedAddress = new EventEmitter<ColdStakingWalletComponent>();
    @Output() onWithdraw = new EventEmitter<ColdStakingWalletComponent>();

    @Input()
    set hotWallet(value: boolean) {
        this._hotWallet = value;
        this.description = value ? 'Coins that you can only stake but other wallets can spend' : 'Coins blah to be defined';
    }
    get hotWallet(): boolean {
        return this._hotWallet;
    }

    @Input()
    set balance(value: number) {
        this._balance = value;
        this.balanceFormatted = this._balance.toLocaleString();
    }

    @Input()
    set amount(value: number) {
        this._amount = value;
        this.amountFormatted = this._amount.toLocaleString();
    }

    ngOnInit() {
        this.wallet = this.walletService.wallet();
        this.buildStakingForm();
    }

    unusedAddressClicked = () => this.onGetFirstUnusedAddress.emit(this);
    withdrawClicked = () => this.onWithdraw.emit(this);

    private buildStakingForm(): void {
        this.stakingForm = this.fb.group({
            'walletPassword': ['', Validators.required]
        });
    }

    public startStaking(): void {
        const walletData = {
          name: this.globalService.getWalletName(),
          password: this.stakingForm.get('walletPassword').value
        };
    
        this.stakingForm.patchValue({walletPassword: ''});
    
        if (this.stakingService.startStaking(walletData)) {
            this.snackbarService.add({
                msg: `You are now staking.`,
                customClass: 'notify-snack-bar',
                action: {
                  text: null
                }
            });
        }
      }
    
      public stopStaking(): void {
        if (this.stakingService.stopStaking()) {
            this.snackbarService.add({
                msg: `Staking is now disabled.`,
                customClass: 'notify-snack-bar',
                action: {
                  text: null
                }
            });
        }
      }
}
