import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WebViewPage } from './web-view';
@NgModule({
  declarations: [WebViewPage],
  imports: [IonicPageModule.forChild(WebViewPage)],
})
export class WebViewPageModule { }
