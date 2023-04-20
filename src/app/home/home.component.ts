import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/models/post.class';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { DialogAddConversationComponent } from '../dialog-components/dialog-add-conversation/dialog-add-conversation.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  panelOpenState = false;
  activeUserId: string = 'testUserId';
  activeConversationId: string = 'testConversationId'
  conversations: Post[] = [];
  allPosts: Post[] = [];
  chats: string[] = [];
  channels: string[] = [];
  loading: boolean = false;
  currentUser: any= '';

  constructor(
    public authService: AuthService,
    private firestore: AngularFirestore,
    public dialog: MatDialog,
    private userService: UserService,) { }

  ngOnInit() {
    this.userService.getData();
    //console.log(this.userService.currentUser);
    

    this.firestore
      .collection('conversations')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((changes: any) => {
        this.allPosts = changes;
        this.conversations = changes.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
        this.updateConversations();
      })


  };

  //
  updateConversations() {
    this.collectChats();
    this.collectChannels();
    let filterdConversations = [];
    for (let i = 0; i < this.conversations.length; i++) {
      const element = this.conversations[i];
      if (element['conversationId'] == this.activeConversationId) {
        let _post = new Post();
        _post.activeUser = element.activeUser;
        _post.conversationId = element.conversationId;
        _post.conversationType = element.conversationType;
        _post.isRead = element.isRead;
        _post.message = element.message;
        _post.subPost = element.subPost;
        _post.timeStamp = element.timeStamp;
        _post.userId = element.userId;
        filterdConversations.push(_post);
      }
    }
    this.conversations = filterdConversations.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
    
  }

  collectChats() {
    this.allPosts.forEach(post => {
      if (post.conversationType == 'chat') {
        if (!this.chats.includes(post.conversationId)) this.chats.push(post.conversationId);
      }

    });
  }

  collectChannels() {
    this.allPosts.forEach(post => {
      if (post.conversationType == 'channel') {
        if (!this.channels.includes(post.conversationId)) this.channels.push(post.conversationId);
      }
    });
  }

  openSettings() {
    this.dialog.open(UserSettingsComponent);
  }

  changeActiveConversationId(conversation: string) {
    this.activeConversationId = conversation;
    this.ngOnInit()
  }

  openAddConversation(conversationType: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { convType: conversationType }
    this.dialog.open(DialogAddConversationComponent, dialogConfig);
  }

}

