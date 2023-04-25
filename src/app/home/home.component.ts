import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/models/post.class';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { DialogAddConversationComponent } from '../dialog-components/dialog-add-conversation/dialog-add-conversation.component';
import { DialogAddChannelComponent } from '../dialog-components/dialog-add-channel/dialog-add-channel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  panelOpenState = false;
  activeUserId: string = 'testUserId';
  activeConversationId: string = '';
  conversations: Post[] = [];
  chats: Post[] = [];
  currentUser: any= '';
  channels: Post[] = [];
  allPosts: any;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  activeConversationTyp: string;
  

  constructor(
    public authService: AuthService,
    private firestore: AngularFirestore,
    public dialog: MatDialog,
    public userService: UserService,) { }

  ngOnInit() {
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
        this.allPosts = changes;
        this.conversations = changes.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
        this.updateConversations();
      });
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
    this.chats = [];
    this.allPosts.forEach(post => {
      if (post.conversationType == 'chat') {
        if (!this.chats.includes(post.conversationId)) this.chats.push(post.conversationId);
      }

    });
  }

  collectChannels() {
    this.channels = [];
    this.allPosts.forEach(post => {
      if (post.conversationType == 'channel') {
        if (!this.channels.includes(post.conversationId)) this.channels.push(post.conversationId);
      }
    });
  }

  openSettings() {
    this.dialog.open(UserSettingsComponent);
  }

  changeActiveConversationId(conversation: any, type: string) {
    this.activeConversationId = conversation;
    this.activeConversationTyp = type;
    this.ngOnInit()
  }

  openAddConversation(conversationType: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { convType: conversationType }
    this.dialog.open(DialogAddConversationComponent, dialogConfig);
  }

  openAddChannel() {
    this.dialog.open(DialogAddChannelComponent);
  }
}


// import firebase from 'firebase/app';
// import 'firebase/firestore';

// // Assuming you have already initialized Firebase and have a Firestore instance
// const db = firebase.firestore();

// // Interface for the conversation object
// interface Conversation {
//   id: string;
//   messages: string[];
// }

// // Function to search for a message in conversations
// const searchMessage = async (message: string): Promise<Conversation[]> => {
//   try {
//     // Query conversations collection to get all documents
//     const snapshot = await db.collection('conversations').get();
//     const conversations: Conversation[] = [];

//     // Loop through each document
//     snapshot.forEach((doc) => {
//       const conversation = doc.data() as Conversation;
      
//       // Check if the conversation has the message
//       if (conversation.messages.includes(message)) {
//         conversations.push({ id: doc.id, ...conversation });
//       }
//     });

//     return conversations;
//   } catch (error) {
//     console.error('Error searching for message:', error);
//     throw error;
//   }
// };

// // Usage
// const searchTerm = 'hello';
// searchMessage(searchTerm)
//   .then((conversations) => {
//     console.log('Conversations containing the message:', conversations);
//   })
//   .catch((error) => {
//     console.error('Error searching for message:', error);
//   });


