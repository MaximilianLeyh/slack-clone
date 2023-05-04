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
  ngOnInit(): void {
    this.users = this.userservice.getUsers();
  }

createConversation() {
  let post = new Post();
  this.loading = true;
  post.timeStamp = new Date().getTime();
  post.conversationId = this.userName + "|" + this.post.threadId;
  post.conversationType = 'chat';
  post.subPost = false;
  post.threadId = this.post.threadId;
  post.message = this.chatDescription + this.userName;
  post.userId = this.userName
  this.postservice.create(post);
}

}
