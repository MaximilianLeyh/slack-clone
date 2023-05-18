import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})

export class StartScreenComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  /**
   * opens the dialog for the loginComponent
   */
  openLogin() {
    this.dialog.open(LoginComponent);
  }

  /**
   * opens the dialog for the registerComponent
   */
  openSignUp() {
    this.dialog.open(RegisterComponent);
  }


}