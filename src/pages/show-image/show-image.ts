import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the ShowImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-image',
  templateUrl: 'show-image.html',
})
export class ShowImagePage {
  imageUrl: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
    this.imageUrl = navParams.get('imageUrl');
    //alert(this.imageUrl);
  }
  

  dismiss() {
    console.log('HELLOOOOOOO');
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowImagePage');
  }

}
