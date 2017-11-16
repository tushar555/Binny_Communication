import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController,ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: any;
  public backgroundImage: any = "./assets/bg1.jpg";
  public imgLogo: any = "./assets/medium_150.70391061453px_1202562_easyicon.net.png";
  public data:any=[];
  user_type:any;
  constructor(private storage:Storage,public http:Http,public navCtrl: NavController, public fb: FormBuilder,public toastCtrl:ToastController ,public alertCtrl: AlertController,public loadingCtrl: LoadingController) {
      let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      this.loginForm = fb.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }

  login(){
      if (!this.loginForm.valid){
          //this.presentAlert('Username password can not be blank')
          this.presentToast('Please Provide Correct Credentials',false,"");
      } else {
       
        let loadingPopup = this.loadingCtrl.create({
          spinner: 'crescent', 
          content: ''
        });
        loadingPopup.present();
        let link = "https://progressiveinteractive.com/communication/login.php";
        let data = JSON.stringify({"email":this.loginForm.value.email,"password":this.loginForm.value.password});
        this.http.post(link,data).timeout(8000).map(res=>res.json()).subscribe((data)=>{
        console.log(data);
        if(data.code == 'false'){
          this.presentToast("Wrong Credentials!",'wrong',this.data); 
          loadingPopup.dismiss();         
        }else{
          this.user_type= data.user_type;
          this.data = data.server_response;
          console.log("BHAI",this.user_type);
          this.presentToast("Login Successfull",true,this.data);
          this.storage.set('email', this.loginForm.value.email); 
          loadingPopup.dismiss();
        }
         
        },(error)=>{
          loadingPopup.dismiss();
          this.presentToast("Please Check Network Connection!",false,"");
          
        });
        
        
      }
  }

  presentToast(message,flag,getData) {
   
    const toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      if(flag==true && flag!='wrong'){
        if(this.user_type=='sales')
         this.navCtrl.setRoot(HomePage,{"data":getData,"user_type":this.user_type});
        else
          this.navCtrl.setRoot("ChatDetailPage",{"data":getData,"user_type":this.user_type});
        
      }
     
    });
  
    toast.present();
  }

  forgot(){
   // this.navCtrl.push('ForgotPage');
  }

  createAccount(){
   // this.navCtrl.push('RegisterPage');
  }
  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['OK']
    });
    alert.present();
  }

}
