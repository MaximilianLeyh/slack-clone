import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Conversation } from 'src/models/conversation.class';
import { Post } from 'src/models/post.class';

@Component({
  selector: 'app-post-overview',
  templateUrl: './post-overview.component.html',
  styleUrls: ['./post-overview.component.scss']
})
export class PostOverviewComponent {
  headerTitle: string = '# filledFromDB';
  loading: boolean = false;
  message = '';
  post: Post;
  @Input() activeUserId: string = '';
  @Input() activeConversationId: string = '';
  emptyInput: string = '';

  constructor(private firstore: AngularFirestore) { }

  savePost() {
    this.loading = true;
    this.post = new Post();
    this.post.timeStamp = new Date().getTime();
    this.post.userId = this.activeUserId;
    this.post.conversationId = this.activeConversationId;
    this.post.conversationType = 'chat';
    this.post.subPost = false;
    this.firstore
      .collection('posts')
      .add(this.post.toJSON())
      .then((result: any) => {
        this.loading = false;
        console.log(this.post);
      });
    this.emptyInput = '';
    //this.loading = false;
  }

}
