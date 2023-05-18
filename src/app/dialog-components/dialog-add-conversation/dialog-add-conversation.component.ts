import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/models/post.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-dialog-add-conversation',
  templateUrl: './dialog-add-conversation.component.html',
  styleUrls: ['./dialog-add-conversation.component.scss']
})
export class DialogAddConversationComponent implements OnInit {

  loading = false;
  post = new Post();
  receiverName: string = '';
  userName: string = '';
  users: string[] = [];
  chatDescription: string = 'This is the private chat between you and '

  


  constructor(private postservice: PostService, @Inject(MAT_DIALOG_DATA) public data, private userservice: UserService)  {
  this.userName = data.userName;
}
  /**
   * this ngOnInit function initializes the component by retrieving a list of users from the userservice and assigning it to the users property. 
   * It also logs the value of the userName property to the console
   */
  ngOnInit(): void {
    this.users = this.userservice.getUsers();
    console.log(this.userName);
  }

/**
 * this function creates a new conversation by initializing a Post object with various properties, 
 * including the conversation ID, type, timestamp, message, and user ID. The postservice is then used to create and store the conversation post.
 */
createConversation() {
  let post = new Post();
  this.loading = true;
  post.timeStamp = new Date().getTime();
  post.conversationId = this.userName + "|" + this.post.threadId;
  post.conversationType = 'chat';
  post.subPost = false;
  post.threadId = this.post.threadId;
  post.message = this.chatDescription + this.post.threadId;
  post.userId = this.userName
  this.postservice.create(post);
}

}
