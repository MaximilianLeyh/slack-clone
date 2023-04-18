import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Conversation } from 'src/models/conversation.class';
import { Post } from 'src/models/post.class';
import { HomeComponent } from '../home/home.component';


@Component({
  selector: 'app-post-overview',
  templateUrl: './post-overview.component.html',
  styleUrls: ['./post-overview.component.scss']
})
export class PostOverviewComponent implements OnInit {
  headerTitle: string = '# filledFromDB';
  loading: boolean = false;
  message = '';
  post: Post;
  @Input() activeUserId: string = '';
  @Input() activeConversationId: string = '';
  emptyInput: string = '';
  

  constructor(private firstore: AngularFirestore, public home: HomeComponent) {}

  ngOnInit(): void {
  }

  


  savePost() {
    this.loading = true;
    this.post = new Post();
    this.post.timeStamp = new Date().getTime();
    this.post.userId = this.activeUserId;
    this.post.conversationId = this.activeConversationId;
    this.post.conversationType = 'chat';
    this.post.subPost = false;
    this.post.message = this.message;
    this.firstore
      .collection('conversations')
      .add(this.post.toJSON())
      .then((result: any) => {
        this.loading = false;
        this. message = '';
      });
    
  }


}
