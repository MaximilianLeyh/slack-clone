import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Conversation } from 'src/models/conversation.class';
import { Post } from 'src/models/post.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  panelOpenState = false;
  activeUserId: string = 'testUserId';
  activeConversationId: string = 'testConversationId'
  channels: Post[] = [];
  chats: Post[] = [];

  constructor(
    public authService: AuthService,
    private firestore: AngularFirestore,
    private userService: UserService,) { }

  async ngOnInit() {
    this.userService.getData();

    await this.firestore.collection('conversations').valueChanges().forEach(conv => {
      this.updateChannels(conv);
      console.log('die channels', this.channels);
      this.updateChats(conv);
      console.log('die chats', this.chats);

    })


  };

  updateChannels(conv: any) {
    this.channels = [];
    for (let i = 0; i < conv.length; i++) {
      const element = conv[i];
      if (element['conversationType'] == 'channel') {
        let _post = new Post();
        _post.activeUser = element.activeUser;
        _post.conversationId = element.conversationId;
        _post.conversationType = element.conversationType;
        _post.isRead = element.isRead;
        _post.message = element.message;
        _post.subPost = element.subPost;
        _post.timeStamp = element.timeStamp;
        _post.userId = element.userId;
        this.channels.push(_post);
      }
    }
  }

  updateChats(conv: any) {
    this.chats = [];
    for (let i = 0; i < conv.length; i++) {
      const element = conv[i];
      if (element['conversationType'] == 'chat') {
        let _post = new Post();
        _post.activeUser = element.activeUser;
        _post.conversationId = element.conversationId;
        _post.conversationType = element.conversationType;
        _post.isRead = element.isRead;
        _post.message = element.message;
        _post.subPost = element.subPost;
        _post.timeStamp = element.timeStamp;
        _post.userId = element.userId;
        this.chats.push(_post);
      }
    }
  }

}

