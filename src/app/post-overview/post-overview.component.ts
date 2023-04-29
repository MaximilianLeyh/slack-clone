import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Conversation } from 'src/models/conversation.class';
import { Post } from 'src/models/post.class';
import { HomeComponent } from '../home/home.component';
import { Subject } from 'rxjs';


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
  @Input() activeConversationType: string = '';
  @Input() showThreads:boolean = true;
  @Output() showThreadsChange = new EventEmitter<boolean>();
  @Input() threadId: string ;
  @Output() threadIdChange = new EventEmitter<string>();
  @Input() threadIdObs:boolean;
  @Output() threadIdObsChange = new EventEmitter<boolean>();
  emptyInput: string = '';
  allPosts: any;
  conversations: Post[] = [];
  

  constructor(private firstore: AngularFirestore, public home: HomeComponent) {}

  

  ngOnInit(): void {
    this.firstore
      .collection('conversations')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((changes: any) => {
        this.allPosts = changes;
        this.conversations = changes.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
        console.log('conversationslänge',this.conversations.length);
        this.updateConversations();
      });
  }

  ngOnChange(){
    this.ngOnInit();
  }

  updateConversations() {
    console.log(this.conversations);
    
    let filterdConversations = [];
    for (let i = 0; i < this.conversations.length; i++) {
      const element = this.conversations[i];
      if (element['conversationId'] == this.activeConversationId && element['conversationType'] == this.activeConversationType) {
        let _post = new Post();
        _post.activeUser = element.activeUser;
        _post.conversationId = element.conversationId;
        _post.conversationType = element.conversationType;
        _post.isRead = element.isRead;
        _post.message = element.message;
        _post.subPost = element.subPost;
        _post.timeStamp = element.timeStamp;
        _post.userId = element.userId;
        _post.threadId = element.threadId;
        _post.threadAmount = element.threadAmount;
        _post.customIdName = element.customIdName;
        filterdConversations.push(_post);
      }
    }
    this.conversations = filterdConversations.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
    
  }

  


  savePost() {
    this.loading = true;
    this.post = new Post();
    this.post.timeStamp = new Date().getTime();
    this.post.userId = this.activeUserId;
    this.post.conversationId = this.activeConversationId;
    this.post.conversationType = this.activeConversationType;
    this.post.subPost = true;
    this.post.message = this.message;
    this.post.threadId = this.randomId();
    this.post.threadAmount = 1;
    this.firstore
      .collection('conversations')
      .add(this.post.toJSON())
      .then((result: any) => {
        this.loading = false;
        this. message = '';
      });
    
  }

  randomId(){
    return Math.random().toString(36).replace('0.', 'thread_');
  }

  openThread(threadId:string) {
    this.showThreadsChange.emit(true);
    this.threadIdObsChange.emit(!this.threadIdObs);
    this.threadIdChange.emit(threadId); 
  }


}
