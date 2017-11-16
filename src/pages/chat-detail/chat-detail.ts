import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController,Platform,LoadingController,ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { File } from '@ionic-native/file';
import { FileTransfer,FileTransferObject } from '@ionic-native/file-transfer';
import 'rxjs/Rx';
import { Camera,CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';


@IonicPage()
@Component({
  selector: 'page-chat-detail',
  templateUrl: 'chat-detail.html',
  //providers : [File,FilePath,Camera]
})
export class ChatDetailPage {
  data:any=[];
  client_name:any;
  client_email:any;
  user_type:any;
  getChatData:any;
  storageEmail:any;
  chatPresent:any;
  message:any;
  time :any;
  uploadpic:any;
  NewFileName:any;
  storageDir:any;
  image:any;
  flag:any=0;
  chatId:any;
  imageUrl:any = "http://i.imgur.com/TnNwdvV.png";
  constructor(private imagePicker: ImagePicker,public modalCtrl:ModalController,public transfer:FileTransfer, private file:File,private loadingCtrl:LoadingController,private platform:Platform,private filePath:FilePath,private camera:Camera,public alertCtrl:AlertController,public toastCtrl:ToastController,private http:Http,private storage:Storage,public navCtrl: NavController, public navParams: NavParams) {
    this.data=this.navParams.get('data');
    this.image="http://i.imgur.com/TnNwdvV.png";
    this.user_type = this.navParams.get('user_type');  

    if(this.user_type=='sales'){
      this.client_name = this.data.client_name;
      this.client_email = this.data.client_email;
      
    } 
    this.storage.get('email').then((email)=>{
        this.storageEmail = email;
        console.log("RADA",email);
    });
   
   this.time =  setInterval(()=>{
     this.ionViewDidLoad();
   },2000);

   this.platform.ready().then(()=>{
    if(this.platform.is('ios')){
      this.storageDir = this.file.dataDirectory;
    }else if(this.platform.is('android')){
     // this.storageDir = this.file.dataDirectory;
     this.storageDir = "file:///storage/emulated/0/Download/";
    }

});
  }

ionViewWillLeave(){
  clearInterval(this.time);
  console.log("dsd");
}

tapEve(){
  this.flag = !this.flag;
  console.log("EENENE");
}
delete(chatId){
  this.flag = !this.flag;
  this.chatId = chatId;
  let alert = this.alertCtrl.create({
    title: 'Confirm delete',
    message: 'Do you want to delete this message?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Delete',
        handler: () => {
          let link = 'https://progressiveinteractive.com/communication/delete_mesage.php';
          let data = JSON.stringify({"chatId":chatId});
          this.http.post(link,data).map(res=>res.json()).subscribe((data)=>{
            console.log(data);
              let toast = this.toastCtrl.create({
                message: 'Message Deleted',
                duration: 1000,
                position: 'bottom'
              });
            toast.present();
          }); 
        }
      }
    ]
  });
  alert.present();
}

openImage(imageName){
  this.modalCtrl.create('ShowImagePage', {"imageUrl": "file:///storage/emulated/0/Download/"+imageName}, { cssClass: 'inset-modal' })
  .present();

}

picImage(){
  let options = {
    maximumImagesCount: 8,
    width: 500,
    height: 500,
    quality: 75,
    outputType:1
  }

  this.imagePicker.getPictures(options).then((results) => {
    alert(results[0]);
    for (var i = 0; i < results.length; i++) {
        alert('Image URI: ' + results[i]);
    }
  }, (err) => { });
}


sendImage(){
  console.log("sdsd");
  const options: CameraOptions = {
    quality: 100,
   // destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation:true
    //  mediaType: this.camera.MediaType.PICTURE
  }

  this.camera.getPicture(options).then((imageData) => {
     let date = new Date(); 
    if(this.platform.is('android')){
                    
                      this.filePath.resolveNativePath(imageData).then(filePath => {
                       
                        this.uploadpic = filePath;
                        let name =  filePath.replace(/^.*[\\\/]/, '');
          
                        this.NewFileName = name;
                        this.presentAlert();
                      })
                   
                      
                    
    }else{
     
           this.uploadpic = imageData;
             
          let name =  imageData.replace(/^.*[\\\/]/, '');
          this.NewFileName = name;
          this.presentAlert();

    
    }  
 
    });


}


downloadImage(path,name,id){
  console.log(path+" "+name+" "+id);
    let  loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: "Please wait your image  Downloading is in process..",
  });
  loadingPopup.present();

  const fileTransfer: FileTransferObject = this.transfer.create();
  const location = path;
  fileTransfer.download(location,this.storageDir+name).then((entry)=>{
    const alertSuccess = this.alertCtrl.create({
      title: `Download Succeeded!`,
      subTitle: `Successfully downloaded to: ${entry.toURL()}`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            let link = "https://progressiveinteractive.com/communication/change_status.php";
            let data = JSON.stringify({"imageId":id,"name":name});
           
            this.http.post(link,data).map(res=>res.json()).subscribe((data)=>{
              
              loadingPopup.dismiss();
              this.ionViewDidLoad();
            });
          }

        }  
      ]
    });

    alertSuccess.present();
  },(error)=>{
    const alertFailure = this.alertCtrl.create({
      title: `Download Failed!`,
      subTitle: `was not downloaded. Error code: ${error}`,
      buttons: ['Ok']
    });
    loadingPopup.dismiss();
    alertFailure.present();

  }); 
}


presentAlert(){
  let localalert = this.alertCtrl.create({
    title: 'Do you want to send this Picture?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Send',
        handler: () => {
          this.file.copyFile
            this.file.moveFile(this.uploadpic,this.NewFileName,"file:///storage/emulated/0/Android/data/io.ionic.Communication/files/",'').then((data)=>{
              alert(data.fullPath);
            },(error)=>{
              alert(error);
            });
            // this.storage.get('email').then((email)=>{

            //   let rcv_email:any;
            //   if(this.user_type=='client'){
            //       rcv_email = this.data[0].sales_email;
            //   }else{
            //       rcv_email = this.client_email;
            //   }

            //   let  loadingPopup = this.loadingCtrl.create({
            //     spinner: 'crescent',
            //     content: "Please wait your image  sending is in process..",
            // });
            // loadingPopup.present();
    
    
            // let link = "https://progressiveinteractive.com/communication/send_image.php";
    
            // const fileTransfer: FileTransferObject = this.transfer.create();
            // var options = {
            //     fileKey: 'file',
            //     fileName: this.NewFileName,
            //     mimeType: 'image/jpeg',
            //     chunkedMode: false, 
            //     params:{
            //             "sender_email":email,
            //             "receiver_email":rcv_email,
            //             "original_path":this.uploadpic
            //            },
            //     headers: {
            //     'Content-Type': undefined
            //     }
            // }
    
            // fileTransfer.upload(this.uploadpic, link, options).then((data) => {
            //   let alert1= this.alertCtrl.create({
            //     title: 'Picture Sent',
            //     buttons: [{
            //         text:'OK',
            //         handler:()=>{
            //           this.ionViewDidLoad();
            //         }
            //     }]
            //   });
            //   alert1.present();
            //    loadingPopup.dismiss(); 
            // });


            // });
                  
    
        }
      }
    ]
  });
  localalert.present();
}


  ionViewDidLoad() {
    
    this.storage.get('email').then((email)  =>{
      let link = "https://progressiveinteractive.com/communication/getClientChat.php";
      let data = JSON.stringify({"user_email":email,"uem":this.client_email});
      
      this.http.post(link,data).timeout(8000).map(res=>res.json()).subscribe((data)=>{
        this.chatPresent=data.code;
        this.getChatData=data.server_response;
        console.log(this.getChatData);
      });
    });

  }
  sendMessage(message){
   
    if(message==''||message==undefined){
        this.presentToast("Message Cannot be empty!");
    }else{
      this.storage.get('email').then((email)=>{
        let rcv_email:any;
        if(this.user_type=='client'){
            rcv_email = this.data[0].sales_email;
        }else{
            rcv_email = this.client_email;
        }
        
        let link = "https://progressiveinteractive.com/communication/sendMessage.php";
        let data = JSON.stringify({"sender_email":email,"receiver_email":rcv_email,"message":message});
        this.http.post(link,data).map(res=>res.json()).subscribe((data)=>{
          if(data.code=='true'){
            this.message='';
            this.ionViewDidLoad()
          }else{
            this.presentToast('Message Cannot Sent!')
          }
            
        });
      })
      
    }
   
  
  }

  doRefresh(refresher) {
   
    this.ionViewDidLoad();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  presentToast(message) {
  
    const toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      
    });
  
    toast.present();
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
          text: 'Logout',
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
