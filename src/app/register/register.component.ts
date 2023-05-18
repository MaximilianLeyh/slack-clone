import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;

  /**
   * This is the constructor of a component named RegisterComponent. It injects the FormBuilder, MatDialogRef, MatDialog, and AuthService services as dependencies.
   */
  constructor(private formBuilder: FormBuilder
    , public dialogRef: MatDialogRef<RegisterComponent>,
    public dialog: MatDialog,
    public authService: AuthService) {
    this.registerForm = this.formBuilder.group({
      displayName: ['', [Validators.required], []],
      email: ['', [Validators.required, Validators.email], []],
      password: ['', [Validators.required], []]
    })
  }

  ngOnInit(): void {

  }

  /**
   * This function closes the current dialog box opened by the MatDialogRef and opens the LoginComponent in a new dialog box.
   */
  closeDialog() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent);
  }
}