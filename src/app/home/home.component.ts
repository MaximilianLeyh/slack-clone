import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/models/post.class';
import { MatDialog } from '@angular/material/dialog';
import { UserSettingsComponent } from '../user-settings/user-settings.component';

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
  chats: Post[] = [];
  currentUser: any= '';

  constructor(
    public authService: AuthService,
    private firestore: AngularFirestore,
    public dialog: MatDialog,
    private userService: UserService,) { }

  async ngOnInit() {
    this.userService.getData();

    // await this.firestore.collection('conversations').valueChanges().forEach(conv => {
    //   this.updateconversations(conv);
    //   this.updateChats();
    //   console.log('die chats', this.chats);
    // })
    this.firestore
      .collection('conversations')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((changes: any) => {
        this.conversations = changes;
        this.conversations = changes.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
        this.updateChats();
      })


  };

  updateChats() {
    let chats = [];
    for (let i = 0; i < this.conversations.length; i++) {
      const element = this.conversations[i];
      if (element['conversationType'] == 'chat' && element['conversationId'] == this.activeConversationId) {
        let _post = new Post();
        _post.activeUser = element.activeUser;
        _post.conversationId = element.conversationId;
        _post.conversationType = element.conversationType;
        _post.isRead = element.isRead;
        _post.message = element.message;
        _post.subPost = element.subPost;
        _post.timeStamp = element.timeStamp;
        _post.userId = element.userId;
        chats.push(_post);
      }
    }
    this.chats = chats.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
  }

  openSettings() {
    this.dialog.open(UserSettingsComponent);
  }

  changeActiveConversationId(conversation: string) {
    this.activeConversationId = conversation;
    this.updateChats();
  }

}

