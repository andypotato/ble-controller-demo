import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';

import bleConfig from '../config/ble.config';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  public isConnected = false;
  private scanTimer: any = false;
  private peripheral = null;
  // -----

  // construction
  constructor(
    private ble: BLE,
    private events: Events
  ) {

  }
  // ---------------------------------------------------------------------------

  // public interface
  public connect() {

    if (this.isConnected) {
      console.log('Still connected - disconnecting first');
      this.disconnect();
    }

    console.log('Requested device connection');

    // scan for bluetooth devices which provide our service
    this.ble.startScan([bleConfig.SERVICE_UUID]).subscribe(
      (device) => { this.onScanDiscovery(device); },
      (error)  => { this.onScanError(error); }
    );

    this.events.publish('Controller:scanStart');
    console.log('Started scanning for devices');
    console.log('Timeout (seconds)', bleConfig.TIMEOUT);

    this.scanTimer = setTimeout(() => {
      console.log('Scan timeout');
      this.ble.stopScan();
      this.events.publish('Controller:scanTimeout');
    }, bleConfig.TIMEOUT * 1000);
  }

  public disconnect() {

    console.log('Requested device disconnect');

    if (this.isConnected) {
      this.ble.disconnect(this.peripheral.id);
    } else {
      console.log('Device is not connected');
    }

    this.isConnected = false;
    this.peripheral = null;
  }

  public sendControllerData(buttons: number, x: number, y: number, z: number) {

    const adj = 255 / 360;

    // create controller data
    // x and y (pitch, roll) range from -180 to 180
    // -> normalize to 0 - 360
    // z (yaw) range is already 0 to 360 - no adjustment is necessary
    const data = new Uint8Array(4);
    data[0] = buttons;
    data[1] = Math.round((x + 180) * adj);
    data[2] = Math.round((y + 180) * adj);
    data[3] = Math.round(z * adj);

    this.sendData(data.buffer as ArrayBuffer);
  }

  private sendData(data: ArrayBuffer) {

    if (!this.isConnected) {
      return;
    }

    // write to device
    this.ble.writeWithoutResponse(
      this.peripheral.id,
      bleConfig.SERVICE_UUID,
      bleConfig.CHAR_UUID,
      data);
  }
  // ---------------------------------------------------------------------------

  // callbacks
  private onScanDiscovery(device) {

    // stop timeout
    clearTimeout(this.scanTimer);
    console.log('Discovered device:', device.id);
    console.log('Name:', device.advertising.kCBAdvDataLocalName);

    this.events.publish('Controller:scanDiscovery', device);

    // connect device
    this.ble.connect(device.id).subscribe(
      (peripheral) => { this.onDeviceConnected(peripheral); },
      (peripheral) => { this.onDeviceDisconnected(peripheral); }
    );
  }

  private onScanError(error) {
    console.log('Scan error:', error);
    this.events.publish('Controller:scanError', { error });
  }

  private onDeviceConnected(peripheral) {

    console.log('Device connected');

    this.isConnected = true;
    this.peripheral = peripheral;

    this.events.publish('Controller:connected', peripheral);
  }

  private onDeviceDisconnected(peripheral) {

    console.log('Device disconnected');

    this.isConnected = false;
    this.peripheral = null;

    this.events.publish('Controller:disconnected', peripheral);
  }
  // ---------------------------------------------------------------------------
}
