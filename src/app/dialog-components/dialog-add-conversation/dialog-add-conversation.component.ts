import { Component, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/models/post.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-conversation',
  templateUrl: './dialog-add-conversation.component.html',
  styleUrls: ['./dialog-add-conversation.component.scss']
})
export class DialogAddConversationComponent {

  loading = false;
  post = new Post();
  receiverName: string = '';
  userName: string = '';


  constructor(private firestore: AngularFirestore, @Inject(MAT_DIALOG_DATA) public data)  {
  this.userName = data.userName;
}

createConversation() {
  let post = new Post();
  this.loading = true;
  post.timeStamp = new Date().getTime();
  post.conversationId = this.userName + "|" + this.post.threadId;
  post.conversationType = 'chat';
  post.subPost = false;
  post.threadId = this.post.threadId;
  post.message = this.post.message;
  post.userId = this.userName
  this.firestore
    .collection('conversations')    
    .add(post.toJSON())
    .then((result: any) => {
      this.loading = false;
      //this. message = '';
    });

}

}
