import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';

import { ControllerService } from '../services/controller.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  // connection status
  public isConnected = false;
  public isConnecting = false;

  // button states
  public buttonState = 0;
  private lastButtonState = 0;

  // gyroscope angles
  public pitch = 0.0;
  public roll = 0.0;
  public yaw = 0.0;
  private lastPitch = 0.0;
  private lastRoll = 0.0;
  private lastYaw = 0.0;

  // the minimum angle which registers as change
  private minAngleChange = 1.0;

  // controller update
  private updateInterval: any = false;
  private FPS = 60;
  // ------

  @HostListener('window:deviceorientation', ['$event'])
  public onDeviceOrientation({ alpha, gamma, beta, absolute }: DeviceOrientationEvent): void {
    this.pitch = Math.round(beta);
    this.roll = Math.round(gamma);
    this.yaw = Math.round(alpha);
  }

  // construction
  constructor(
    private controller: ControllerService,
    private events: Events,
    private alertController: AlertController,
  ) {

  }
  // ---------------------------------------------------------------------------

  // view lifecycle
  ngOnInit() {

    // subscribe to controller events
    this.events.subscribe('Controller:scanError', params => {
      this.connectionError(params.description);
    });
    this.events.subscribe('Controller:scanTimeout', params => {
      this.didTimeout();
    });
    this.events.subscribe('Controller:connected', params => {
      this.didConnect();
    });
    this.events.subscribe('Controller:disconnected', params => {
      this.didDisconnect();
    });
  }

  ngOnDestroy() {

    // unsubscribe from controller events
    this.events.unsubscribe('Controller:scanError');
    this.events.unsubscribe('Controller:scanTimeout');
    this.events.unsubscribe('Controller:connected');
    this.events.unsubscribe('Controller:disconnected');
  }
  // ---------------------------------------------------------------------------

  // UI actions
  public onConnect() {
    this.isConnecting = true;
    this.controller.connect();
    console.log('Connecting bluetooth interface');
  }

  public onDisconnect() {
    this.isConnected = false;
    this.stopUpdate();
    this.controller.disconnect();
    console.log('Disconnected bluetooth interface');
  }

  public onPressButton(idx: number) {
    this.buttonState |= (1 << idx);
    console.log(this.buttonState);
  }

  public onReleaseButton(idx: number) {
    this.buttonState &= ~(1 << idx);
    console.log(this.buttonState);
  }
  // ---------------------------------------------------------------------------

  // event handlers
  private didConnect() {
    console.log('Controller is connected');
    this.isConnecting = false;
    this.isConnected = true;
    this.startUpdate();
  }

  private didDisconnect() {
    console.log('Controller is disconnected');
    this.isConnecting = false;
    this.isConnected = false;
    this.stopUpdate();
  }

  private didTimeout() {
    this.isConnecting = false;
    this.presentAlert('Timeout', 'The connection timed out');
  }

  private connectionError(reason: string) {
    this.isConnecting = false;
    this.presentAlert('Connection error', reason);
  }
  // ---------------------------------------------------------------------------

  // implementation
  private startUpdate() {
    this.updateInterval = setInterval(() => {
      this.sendData();
    }, 1000 / this.FPS);
    console.log('Controller updates started');
  }

  private stopUpdate() {
    clearInterval(this.updateInterval);
    console.log('Controller updates stopped');
  }

  private sendData() {

    // check if there is "enough" change
    if (this.buttonState !== this.lastButtonState ||
        Math.abs(this.pitch - this.lastPitch) >= this.minAngleChange ||
        Math.abs(this.roll - this.lastRoll) >= this.minAngleChange ||
        Math.abs(this.yaw - this.lastYaw) >= this.minAngleChange) {

      // send data via BT service
      this.controller.sendControllerData(this.buttonState, this.pitch, this.roll, this.yaw);
    }

    this.lastButtonState = this.buttonState;
    this.lastPitch = this.pitch;
    this.lastRoll = this.roll;
    this.lastYaw = this.yaw;
  }
  // ---------------------------------------------------------------------------

  // helpers
  private async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header, message, buttons: ['OK']
    });

    await alert.present();
  }
  // ---------------------------------------------------------------------------
}
