import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/models/post.class';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { DialogAddConversationComponent } from '../dialog-components/dialog-add-conversation/dialog-add-conversation.component';
import { DialogAddChannelComponent } from '../dialog-components/dialog-add-channel/dialog-add-channel.component';
import { Subject } from 'rxjs/internal/Subject';
import { set } from '@angular/fire/database';
import { DrawerTogglerService } from '../services/drawer-toggler.service';
import { DialogEditProfilePictureComponent } from '../dialog-components/dialog-edit-profile-picture/dialog-edit-profile-picture.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  panelOpenState = false;
  activeUserId: string = '';
  activeConversationId: string = 'choose a Channel oder Chat';
  conversations: Post[] = [];
  chats: string[] = [];
  currentUser: any= '';
  channels: string[] = [];
  allPosts: any;
  activeConversationType: string;
  showThreads:boolean = false;
  threadId: string;
  threads: Post[] = [];
  threadIdObs:boolean = false;
  //activeConversationTyp: string;
  displayNotiffication: boolean = false;
  loggedIn: boolean = true;
  profileImg: '';
  avatars = [];
  searchString = '';

  constructor(
    public authService: AuthService,
    private firestore: AngularFirestore,
    public dialog: MatDialog,
    public userService: UserService,
    public toggler: DrawerTogglerService
    ) { }

  ngOnInit() {
    this.userService.getData();
    
    
    this.firestore
      .collection('conversations')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((changes: any) => {
        this.allPosts = changes;
        this.conversations = changes.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
        this.getUserValues()
        this.setUserId();
        
      });
  };

  setUserId(){
   
      this.userService.currentUser$.subscribe(user => {
        this.activeUserId = user.userName;
        if(this.activeUserId.length > 0) localStorage.setItem('loggedUser', this.activeUserId);
      else this.activeUserId = localStorage.getItem('loggedUser');
      //console.log('homeinit',this.activeUserId);  
      this.collectChats();
      this.collectChannels();   
      })  ;
  
  }

  setUserValues(){
    localStorage.setItem('lastConversationId', this.activeConversationId)
    localStorage.setItem('lastConversationType', this.activeConversationType)
  }

  getUserValues(){
    this.activeConversationId = localStorage.getItem('lastConversationId');
    this.activeConversationType = localStorage.getItem('lastConversationType');
  }

  removeUser(name: string){
    let one = name.replace(this.activeUserId,'');
    return one.replace('|','')
  }

  getUserAvatar(userId: string) {
    let value = 'blank-profile.png';
    this.userService.users.forEach(user => {
      if(user.userName === userId) value = user.profileImg;
    });
    return value;
  }

  collectChats() {
    this.chats = [];
    this.allPosts.forEach(post => {
      if (post.conversationType == 'chat' && post.conversationId.includes(this.activeUserId)) {
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


  openLogout() {
    this.dialog.open(UserSettingsComponent);
  }

  openEditProfil() {
    this.dialog.open(DialogEditProfilePictureComponent);
  }

  changeActiveConversationId(conversation: any, type: string) {
    this.activeConversationId = conversation;
    this.activeConversationType = type;
    this.setUserValues();
  }

  openAddConversation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { userName: this.activeUserId }
    this.dialog.open(DialogAddConversationComponent, dialogConfig);
  }

  openAddChannel() {
    this.dialog.open(DialogAddChannelComponent);
  }

  closeSidenav() {
   this.displayNotiffication = !this.displayNotiffication;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth < 800) {
      this.toggler.type = 'over';
      this.toggler.open = false;
      this.toggler.showToggleBtn = true;
      this.displayNotiffication = true;
    } else {
      this.toggler.type = 'side';
      this.toggler.open = true;
      this.toggler.showToggleBtn = false;
      this.displayNotiffication = false;
    }
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


