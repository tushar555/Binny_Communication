import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  data:any=[];
  user_type:any;
  constructor(public alertCtrl:AlertController,public storage:Storage,public http:Http,public navCtrl: NavController,public nav: NavParams) {
   
    this.data = this.nav.get('data');
    this.user_type =this.nav.get('user_type');
    console.log("BRODA",this.data);
  }
  fetch(){
    console.log("dsd");
    this.http.get('https://progressiveinteractive.com/test.php').map(res=>res.json()).subscribe((data)=>{
      this.data =data.server_response;
      console.log(this.data);
  })
  }
  detail(data){
    this.navCtrl.push('ChatDetailPage',{data,"user_type":this.user_type});
  }
  
  logout(){
    let alert = this.alertCtrl.create({
      title: 'Confirm Exit',
      message: 'Do you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Buy',
          handler: () => {
            this.storage.clear();
            this.navCtrl.setRoot('LoginPage');
          }
        }
      ]
    });
    alert.present();
  
  }
}
