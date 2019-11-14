import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, AbstractControl, ValidatorFn, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {UserLoginServiceService} from '../user-login-service.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  hide = true;
  usernameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    forbiddenNameValidator(/aa/i, this.userLoginService),
  ])
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    // checkEmailExists(/a/i, this.userLoginService),
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  constructor(private userLoginService:UserLoginServiceService) {}


  matcher = new MyErrorStateMatcher();

  onsubmit() {
   
    this.emailFormControl.setErrors({
      emailExists: this.userLoginService.checkEmailAlreadyExists(this.emailFormControl.value)
    });
    this.usernameFormControl.setErrors({
      usernameExists: this.userLoginService.checkUsernameAlreadyExists(this.usernameFormControl.value)
    })
    if(!this.emailFormControl.hasError('emailExists') && !this.usernameFormControl.hasError('usernameExists'))
    this.userLoginService.registerUser(this.usernameFormControl.value ,this.emailFormControl.value, this.passwordFormControl.value);
  }

  ngOnInit() {
  }

}

export function forbiddenNameValidator(nameRe: RegExp, userLoginService:UserLoginServiceService): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const username = /^[ \w\d]+$/;
    // const email = /^[\w\d\._%+-]+@[\w\d\.-]+\.\w{2,}/;
    let lower = false;
    const validUsername  = username.test(control.value);
    if(control.value === control.value.toLowerCase())
      lower = true;
     if((!validUsername || !lower) && control.value != '') return {'forbiddenName': {value: control.value}} 
     else
     return null;

  }
}
