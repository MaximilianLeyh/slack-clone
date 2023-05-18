import { Component, HostListener, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
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
export class HomeComponent implements OnInit, OnChanges {
  panelOpenState = false;
  activeUserId: string = '';
  activeConversationId: string = 'choose a Channel oder Chat';
  conversations: Post[] = [];
  chats: string[] = [];
  currentUser: any = '';
  channels: string[] = [];
  allPosts: any;
  activeConversationType: string;
  @Input() showThreads: boolean = false;
  threadId: string;
  threads: Post[] = [];
  threadIdObs: boolean = false;
  displayNotiffication: boolean = false;
  loggedIn: boolean = true;
  profileImg: '';
  avatars = [];
  searchString = '';
  isMobile = false;

  constructor(
    public authService: AuthService,
    private firestore: AngularFirestore,
    public dialog: MatDialog,
    public userService: UserService,
    public toggler: DrawerTogglerService
  ) { }

  ngOnChanges(): void {

  }

  ngOnInit() {
    /**
     * if window.innerWidth < 800px changes is.Mobile to true wich close the navbar
     */
    this.userService.getData();
    if (window.innerWidth < 800) this.isMobile = true;

    /**
     * his function subscribes to changes in the "conversations" collection in Firestore, sorts the resulting array by timeStamp, and updates the conversations in the UI
     */
    this.firestore
      .collection('conversations')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((changes: any) => {
        this.allPosts = changes;
        this.conversations = changes.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
        this.getUserValues();
        this.setUserId();
      });
  };

  /**
   * Gives the username  his userid
   */
  setUserId() {

    this.userService.currentUser$.subscribe(user => {
      this.activeUserId = user.userName;
      if (this.activeUserId.length > 0) localStorage.setItem('loggedUser', this.activeUserId);
      else this.activeUserId = localStorage.getItem('loggedUser');  
      this.collectChats();
      this.collectChannels();
    });
  }

  /**
   * sets the value of the specified Storage Object item
   */
  setUserValues() {
    localStorage.setItem('lastConversationId', this.activeConversationId)
    localStorage.setItem('lastConversationType', this.activeConversationType)
  }

  /**
   * returns value of the specified Storage Object item
   */
  getUserValues() {
    this.activeConversationId = localStorage.getItem('lastConversationId');
    this.activeConversationType = localStorage.getItem('lastConversationType');
  }

  /**
   * returns a new string with the value(s) replaced
   */
  removeUser(name: string) {
    let one = name.replace(this.activeUserId, '');
    return one.replace('|', '')
  }

  /**
   * returns the user profil img
   */
  getUserAvatar(userId: string) {
    let value = 'blank-profile.png';
    this.userService.users.forEach(user => {
      if (user.userName === userId) value = user.profileImg;
    });
    return value;
  }

  /**
   * shows all chats with the user
   */
  collectChats() {
    this.chats = [];
    this.allPosts.forEach(post => {
      if (post.conversationType == 'chat' && post.conversationId.includes(this.activeUserId)) {
        if (!this.chats.includes(post.conversationId)) this.chats.push(post.conversationId);
      }
    });
  }

  /**
   * shows all post in the channel
   */
  collectChannels() {
    this.channels = [];
    this.allPosts.forEach(post => {
      if (post.conversationType == 'channel') {
        if (!this.channels.includes(post.conversationId)) this.channels.push(post.conversationId);
      }
    });
  }

  /**
   * open the userSettingsDialog
   */
  openLogout() {
    this.dialog.open(UserSettingsComponent);
  }

  /**
   * opens editPictureDialog
   */
  openEditProfil() {
    this.dialog.open(DialogEditProfilePictureComponent);
  }

  /**
   * changes the active conversation
   */
  changeActiveConversationId(conversation: any, type: string) {
    this.activeConversationId = conversation;
    this.activeConversationType = type;
    this.setUserValues();
  }

  /**
   * opens the dialogAddConversations
   */
  openAddConversation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { userName: this.activeUserId }
    this.dialog.open(DialogAddConversationComponent, dialogConfig);
  }

  /**
   * opens the dialogAddChannel
   */
  openAddChannel() {
    this.dialog.open(DialogAddChannelComponent);
  }

  /**
   * open or closes the SidenavComponent
   */
  closeSidenav() {
    this.displayNotiffication = !this.displayNotiffication;
  }

  /**
   * Rezise-Event: if the window.innerwidth< 800 the navbar gets closed and the arrow spins
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth < 800) {
      this.closeToggler();
    } else {
      this.openToggler();
    }
  }

  closeToggler() {
    this.toggler.type = 'over';
      this.toggler.open = false;
      this.toggler.showToggleBtn = true;
      this.displayNotiffication = true;
      this.isMobile = true;
  }

  openToggler() {
    this.toggler.type = 'side';
      this.toggler.open = true;
      this.toggler.showToggleBtn = false;
      this.displayNotiffication = false;
      this.isMobile = false;
  }
}