import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { DefaultSettings, ClientSettings, SettingsService } from '../../app/settings.service';

@IonicPage()
@Component({
  templateUrl: 'tunnel-settings.html'
})
export class TunnelSettingsPage {

  private settings: ClientSettings;

  constructor(public viewCtrl: ViewController,
              private settingsService: SettingsService,
              private navCtrl: NavController,
              private toastCtrl: ToastController
             ) {
    this.settings = new DefaultSettings();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.settingsService.readSettings().then((settings) => this.settings = settings);
  }

  saveSettings() {
    this.settingsService.writeSettings(this.settings);
  }

  home() {
    this.navCtrl.popToRoot();
  }
}
