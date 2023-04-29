import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, updateDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dialog-edit-profile-picture',
  templateUrl: './dialog-edit-profile-picture.component.html',
  styleUrls: ['./dialog-edit-profile-picture.component.scss']
})
export class DialogEditProfilePictureComponent {
  profileImg: '';
  currentUser: '';
  loading = false;
  public images: any = [
    {
      name: 'Pinguin',
      img: '../../assets/img/profil/pingu.png',
    },
    {
      name: 'Standard',
      img: '../../assets/img/profil/blank-profile.png',
    },
    {
      name: 'Female',
      img: '../../assets/img/profil/female1.png',
    },
    {
      name: 'Male',
      img: '../../assets/img/profil/male1.png',
    },
    {
      name: 'Sunglasses',
      img: '../../assets/img/profil/sunglasses.png',
    },
    {
      name: 'american-football',
      img: '../../assets/img/profil/american-football.png',
    },
  ];

  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    public auth: AuthService,
    private router: Router,
    private firestore: AngularFirestore,) { }

  changeProfileImg() {
    
  }
}
