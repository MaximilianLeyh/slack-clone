import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HomeComponent } from '../home/home.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { StartScreenComponent } from '../start-screen/start-screen.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email:any;
  password:any;

  constructor(public auth: AngularFireAuth, 
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<RegisterComponent>,
    public router: Router) {}

  ngOnInit(): void {
  }

  login() {
    console.log(`${this.email} ${this.password}`);

    this.auth.signInWithEmailAndPassword(this.email, this.password)
    .catch(error => console.log(error.code))
    .then(res => console.log(res));
    this.dialogRef.close(LoginComponent);
    this.router.navigate(['home'])
  }

}
