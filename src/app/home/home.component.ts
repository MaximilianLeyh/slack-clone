import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  panelOpenState = false;
  activeUserId:string = 'testUserId';
  activeConversationId:string = 'testConversationId'

  constructor(
    public authService: AuthService, 
    private firestore: Firestore, 
    private userService: UserService, ) {}
  
    

    
  async ngOnInit() {
    this.userService.getData();
}
}
