import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, updateDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
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
      name: 'pinguin',
      img: 'pingu.png',
    },
    {
      name: 'standard',
      img: 'blank-profile.png',
    },
    {
      name: 'female',
      img: 'female1.png',
    },
    {
      name: 'male',
      img: 'male1.png',
    },
    {
      name: 'sunglasses',
      img: 'sunglasses.png',
    },
    {
      name: 'american-football',
      img: 'american-football.png',
    },
  ];

  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    public auth: AuthService,
    private router: Router) { }

  changeProfileImg(img: string) {
    this.userService.setImg(img);
  }
}
