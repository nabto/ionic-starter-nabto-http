import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';
import { NabtoService } from '../../app/nabto.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

declare var NabtoError;

@IonicPage()
@Component({
  selector: 'page-web-view',
  templateUrl: 'web-view.html'
})
export class WebViewPage {

  device: NabtoDevice;
  timer: any;
  spinner: any;
  tunnel: string;
  remotePort: number = 8081;
  showSpinner: boolean = true;
  browser: any = null;
  tunnelIsOk: boolean;

  constructor(private navCtrl: NavController,
              private nabtoService: NabtoService,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private iab: InAppBrowser,
              private _ngZone: NgZone) {
    this.device = navParams.get('device');
//    this.device = new NabtoDevice("foo", "w3.test.nabto.net", "tunnel", "foo", "foo", false, false, false);
    this.timer = undefined;
    this.setTunnelOk(true);
  }

  ionViewDidEnter() {
    this.showStream();
  }

  ionViewDidLoad() {
    this.setTunnelOk(true);
  }


  setTunnelOk(state: boolean) {
    this.tunnelIsOk = state;
  }

  ionViewWillLeave() {
    this.nabtoService.closeTunnel(this.tunnel)
      .then(() => {
        console.log(`Tunnel ${this.tunnel} closed`);
      })
      .catch(() => {
        console.log(`Error: Tunnel ${this.tunnel} could not be closed`);
      });
  }

  showStream() {
    this.nabtoService.openTunnel(this.device.id, this.remotePort)
      .then((res: any) => {
        console.log(`Tunnel ${res.tunnelId} connected, portnum is ${res.localPort}, state is ${res.state}`);
        this.tunnel = res.tunnelId;
        //        const browser = this.iab.create('http://127.0.0.1:${res.localPort}/index.html/');
        let options : InAppBrowserOptions = {
          location : 'yes',//Or 'no'
          hidden : 'yes', //Or  'yes'
          clearcache : 'yes',
          clearsessioncache : 'yes',
          zoom : 'yes',//Android only ,shows browser zoom controls
          hardwareback : 'yes',
          mediaPlaybackRequiresUserAction : 'no',
          shouldPauseOnSuspend : 'no', //Android only
          closebuttoncaption : 'Close', //iOS only
          disallowoverscroll : 'no', //iOS only
          toolbar : 'yes', //iOS only
          enableViewportScale : 'no', //iOS only
          allowInlineMediaPlayback : 'no',//iOS only
          presentationstyle : 'pagesheet',//iOS only
          fullscreen : 'yes',//Windows only
        };
        this.browser = this.iab.create(`http://127.0.0.1:${res.localPort}/index.html`, '_blank', options);
        this.setupListeners();
      }).catch(error => {
        this.setTunnelOk(false);
        this.showSpinner = false;
        this.showToast(error.message);
      });
  }

  setupListeners() {
    this.browser.on('loadstop').subscribe(() => {
      this.browserDone(true);
      this.browser.show();
    }, err => {
      console.error(err);
    });

    this.browser.on('exit').subscribe(() => {
      this.browser.close();
    }, err => {
      console.error(err);
    });

    this.browser.on('loaderror').subscribe(() => {
      this.browserDone(false);
      this.browser.close();
    }, err => {
      console.error(err);
    });

  }

  browserDone(ok: boolean) {
    this._ngZone.run(() => {
      this.showSpinner = false;
      this.setTunnelOk(ok);
    });
  }

  showToast(message: string) {
    var opts = <any>{
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 4000
    };
    let toast = this.toastCtrl.create(opts);
    toast.present();
  }

  showSettingsPage() {
    this.navCtrl.push('DeviceSettingsPage', {
      device: this.device
    });
  }

  home() {
    this.navCtrl.setRoot('OverviewPage');
    this.navCtrl.popToRoot();
  }

  reload() {
    if (this.browser != null) {
      this.browser.close();
    }
    this.nabtoService.closeTunnel(this.tunnel).then(() => {
      this.showStream();
    });
  }

}
