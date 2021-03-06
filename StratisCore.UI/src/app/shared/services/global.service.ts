import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { WalletInfo } from '@shared/models/wallet-info';
import { BehaviorSubject, Observable } from 'rxjs';
import { VERSION } from '../../../environments/version';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor(private electronService: ElectronService) {
    this.setApplicationVersion();
    this.setGitCommit();
    this.setSidechainEnabled();
    this.setTestnetEnabled();
    this.setApiPort();
    this.setDaemonIP();
  }

  private applicationVersion = '1.0.0';
  private gitCommit = "";
  private testnet = false;
  private sidechain = false;
  private mainApiPort = 17103;
  private testApiPort = 27103;
  private mainSideChainApiPort = 37223;
  private testSideChainApiPort = 38223;
  private apiPort: number;
  private walletPath: string;
  private currentWalletName: string;
  private currentWalletAccount: string;
  private network: string;
  private daemonIP: string;
  private version = VERSION;

  public coinUnit: string;

  public currentWallet: Observable<WalletInfo> = new BehaviorSubject<WalletInfo>(null);

  public getApplicationVersion(): string {
    return this.applicationVersion;
  }

  public setApplicationVersion(): void {
    if (this.electronService.isElectronApp) {
      this.applicationVersion = this.electronService.remote.app.getVersion();
    }
  }

  public getGitCommit(): string {
    return this.gitCommit;
  }

  public setGitCommit(): void {
    this.gitCommit = this.version.hash;
  }

  public getTestnetEnabled(): boolean {
    return this.testnet;
  }

  public setTestnetEnabled(): void {
    if (this.electronService.isElectronApp) {
      this.testnet = this.electronService.ipcRenderer.sendSync('get-testnet');
    }
  }

  public getSidechainEnabled(): boolean {
    return this.sidechain;
  }

  public get networkName(): string {
    return this.sidechain ? 'cirrus' : 'stratis';
  }

  public setSidechainEnabled(): void {
    if (this.electronService.isElectronApp) {
      this.sidechain = this.electronService.ipcRenderer.sendSync('get-sidechain');
    }
  }

  public getApiPort(): number {
    return this.apiPort;
  }

  public setApiPort(): void {
    if (this.electronService.isElectronApp) {
      this.apiPort = this.electronService.ipcRenderer.sendSync('get-port');
    } else if (this.testnet && !this.sidechain) {
      this.apiPort = this.testApiPort;
    } else if (!this.testnet && !this.sidechain) {
      this.apiPort = this.mainApiPort;
    } else if (this.testnet && this.sidechain) {
      this.apiPort = this.testSideChainApiPort;
    } else if (!this.testnet && this.sidechain) {
      this.apiPort = this.mainSideChainApiPort;
    }
  }

  public getWalletPath(): string {
    return this.walletPath;
  }

  public setWalletPath(walletPath: string): void {
    this.walletPath = walletPath;
  }

  public getNetwork(): string {
    return this.network;
  }

  public setNetwork(network: string): void {
    this.network = network;
  }

  public getWalletName(): string {
    return this.currentWalletName;
  }

  public setWalletName(currentWalletName: string): void {
    this.currentWalletName = currentWalletName;
  }

  public getWallet(): Observable<WalletInfo> {
    return this.currentWallet;
  }

  public setWallet(wallet: WalletInfo): void {
    this.setWalletName(wallet.walletName);
    this.setWalletAccount(wallet.account);
    (this.currentWallet as BehaviorSubject<WalletInfo>).next(new WalletInfo(this.getWalletName(), this.getWalletAccount()));
  }

  public getWalletAccount(): string {
    return this.currentWalletAccount;
  }

  public setWalletAccount(walletAccount): void {
    this.currentWalletAccount = walletAccount || "account 0";
  }

  public getCoinUnit(): string {
    return this.coinUnit;
  }

  public setCoinUnit(coinUnit: string): void {
    this.coinUnit = coinUnit;
  }

  public getDaemonIP(): string {
    return this.daemonIP;
  }

  public setDaemonIP(): void {
    if (this.electronService.isElectronApp) {
      this.daemonIP = this.electronService.ipcRenderer.sendSync('get-daemonip');
    } else {
      this.daemonIP = 'localhost';
    }
  }
}
