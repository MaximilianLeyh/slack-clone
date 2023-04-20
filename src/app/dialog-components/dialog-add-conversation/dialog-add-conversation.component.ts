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
  activeUserId = 'addComponente';
  conversationType = '';


  constructor(private firestore: AngularFirestore, @Inject(MAT_DIALOG_DATA) public data)  {
  this.conversationType = data.convType;
}

createConversation(conversationType: string) {
  this.loading = true;
  let post = new Post();
  post.timeStamp = new Date().getTime();
  post.userId = this.activeUserId;
  post.conversationId = this.post.conversationId;
  post.conversationType = conversationType;
  post.subPost = false;
  post.message = this.post.message;
  this.firestore
    .collection('conversations')
    .add(post.toJSON())
    .then((result: any) => {
      this.loading = false;
      //this. message = '';
    });

}

}
