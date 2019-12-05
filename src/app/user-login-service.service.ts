import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserLoginServiceService {
  userDetails = [];
  constructor() { }

  registerUser(username:string, email:string, password:string, repassword:string, mobile: string) {
    this.userDetails.push({
      username,
      email,
      password,
      repassword,
      mobile
    });
    alert("registered successfully");
  }

  loginUser(usernameOrEmail:string, password:string){
    let valid = 0;
    let wrongPassword = 0;
    for(let i = 0; i < this.userDetails.length; i++){
      if( this.userDetails[i].username == usernameOrEmail || this.userDetails[i].email == usernameOrEmail){
        if(this.userDetails[i].password == password)
        valid = 1;
        else
        wrongPassword = 1;
      }
    }
    if(wrongPassword == 1){
      alert("Invalid Password");
    }
    else if(valid === 0){
      alert("Invalid login please register");
    }
    else {
      alert("Valid details. successfully logged in");
    }
  }

  checkEmailAlreadyExists(email:string){
    for(let i of this.userDetails){
      if(i.email == email)
      return true;
    }
    return false;
  }

  checkUsernameAlreadyExists(username:string){
    for(let i of this.userDetails){
      if(i.username == username)
      return true;
    }
    return false;
  }

  sendForgotPassword(email:string) {
    const emailTester = /^[\w\d\._%+-]+@[\w\d\.-]+\.\w{2,}/;

    if(emailTester.test(email)){
      //Send password to email
      if( this.checkEmailAlreadyExists(email) ){
      alert('password sent to your email');
      return `Password Sent to ${email}`;
      }
      else {
        return "the entered email is not registered";
      }
    }
    else{
      return 'Invalid Email please enter valid email';
    }
  }


}
