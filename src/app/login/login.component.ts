import {Component, Inject } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, AbstractControl, ValidatorFn, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {UserLoginServiceService} from '../user-login-service.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  checked = false;
  status = '';
  forgotEmail = '';
  emailFormControl = new FormControl('', [
    Validators.required,
    // Validators.email,
    Validators.minLength(6),
    forbiddenNameValidator(/a/i),
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  constructor(private userLoginService: UserLoginServiceService, public dialog:MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ForgotPasswordDialog, {
      width: '600px',
      height: '190px',
      data: this.userLoginService
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  matcher = new MyErrorStateMatcher();

  onsubmit() {
    // console.log(this.email);
    // console.log(this.password);
    // console.log(this.emailFormControl.valid);
    console.log(this.emailFormControl.value);
    this.userLoginService.loginUser(this.emailFormControl.value, this.passwordFormControl.value);
  }

}

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const username = /[!#$%^&*()\s]+/;
      const email = /^[\w\d\._%+-]+@[\w\d\.-]+\.\w{2,}/;
      let lower = false;
      const forbidden  = username.test(control.value);
      if(control.value === control.value.toLowerCase())
        lower = true;
       if(forbidden || !lower ) return {'forbiddenName': {value: control.value}} 
       else if(control.value.indexOf('@') !== -1){
          if( !email.test(control.value))
          return {'email': {value: control.value}}
       }
       else
       return null;

    }
}

@Component({
  // selector: '../dialog-content/dialog-content.component',
  templateUrl: '../dialog-content/dialog-content.component.html',
  styleUrls: ['../dialog-content/dialog-content.component.css']
})
export class ForgotPasswordDialog {

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public userLoginService: UserLoginServiceService) {}

    forgotEmail = '';
    status = '';   
  onNoClick(): void {
    this.dialogRef.close();
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  matcher = new MyErrorStateMatcher();

  sendForgotPassword() {
    this.status = this.userLoginService.sendForgotPassword(this.forgotEmail);
  }

}