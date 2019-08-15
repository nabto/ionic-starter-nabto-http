import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { NabtoDevice } from './device.class';

// uses https://github.com/driftyco/ionic-storage

// serializable with simple JSON parse/stringify
export class ClientSettings {
  public port: number;
  public path: string;
  constructor(port: number,
              path: string) {
    this.port = port;
    this.path = path;
  }
}

export class DefaultSettings extends ClientSettings {
  constructor() {
    super(8081, "/");
  }
}


@Injectable()
export class SettingsService {

  private key: string = 'client_settings';

  constructor (private storage: Storage) {
  }

  public readSettings(): Promise<ClientSettings> {
    return this.storage.get(this.key).then((value:string) => {
      var settings: ClientSettings = new DefaultSettings();
      if (value) {
        console.log(`Parsing settings string [${value}]`);
        try {
           settings = JSON.parse(value);
        } catch (error) {
          this.clear();
        }
      }
      return settings;
    });
  }

  public writeSettings(settings: ClientSettings) {
    let value:string = JSON.stringify(settings);
    this.storage.set(this.key, value);
  }

  public clear() {
    this.storage.remove(this.key);
  }

}
