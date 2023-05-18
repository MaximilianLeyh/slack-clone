import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  
  constructor(public userService: UserService,
    public auth: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<UserSettingsComponent>,) { }

  ngOnInit(): void {
  }

  /**
   * the function closes any open dialog window, logs out the current user by calling the appropriate method, 
   * updates the loggedIn state, and redirects the user to the application's home page.
   */
  logout(currentUser) {
    this.dialogRef.close()
    this.auth.logout(currentUser);
    this.auth.loggedIn = false;
    this.router.navigate(['/']);
  }

}