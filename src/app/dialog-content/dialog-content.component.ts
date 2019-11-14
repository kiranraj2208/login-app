import { Component, OnInit } from '@angular/core';
import {UserLoginServiceService} from '../user-login-service.service';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class DialogContentComponent implements OnInit {

  status = '';
  email = '';
  constructor(private userLoginService: UserLoginServiceService) { }

  ngOnInit() {
  }

}
