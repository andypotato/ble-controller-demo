import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';

import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private appMinimize: AppMinimize,
    private insomnia: Insomnia,
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toastController: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      if(this.platform.is('cordova')) {

        this.statusBar.styleDefault();
        this.splashScreen.hide();

        // lock device to landscape
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        console.log('[App] Fixed landscape screen orientation');

        // prevent sleep mode
        this.insomnia.keepAwake()
        .then(
          () => { console.log('[App] Successfully disabled sleep'); },
          () => { console.log('[App] Error entering insomnia'); }
        );
      }

      // Android: do not close app on minimize
      this.platform.backButton.subscribe(() => {
        this.appMinimize.minimize();
      });


    });
  }
}
