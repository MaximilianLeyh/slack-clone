import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Post } from 'src/models/post.class';
import { HomeComponent } from '../home/home.component';
import { PostService } from '../services/post.service';
import { Times } from 'src/models/time.class';
import { map } from 'rxjs';


@Component({
  selector: 'app-post-overview',
  templateUrl: './post-overview.component.html',
  styleUrls: ['./post-overview.component.scss']
})
export class PostOverviewComponent implements OnInit, OnChanges {
  posts: any;
  headerTitle: string = '# filledFromDB';
  loading: boolean = false;
  message = '';
  post: Post = new Post();
  @Input() activeUserId: string = '';
  @Input() activeConversationId: string = '';
  @Input() activeConversationType: string = '';
  @Input() showThreads: boolean = true;
  @Output() showThreadsChange = new EventEmitter<boolean>();
  @Input() threadId: string;
  @Output() threadIdChange = new EventEmitter<string>();
  @Input() threadIdObs: boolean;
  @Output() threadIdObsChange = new EventEmitter<boolean>();
  emptyInput: string = '';
  allPosts: any;
  conversations: Post[] = [];
  times: Times = new Times;


  constructor(private postService: PostService, public home: HomeComponent) { }



  ngOnInit(): void {
    this.retrievePosts();
    // this.firstore
    //   .collection('conversations')
    //   .valueChanges({ idField: 'customIdName' })
    //   .subscribe((changes: any) => {
    //     this.allPosts = changes;
    //     this.conversations = changes.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
    //     console.log('conversationslänge',this.conversations.length);
    //     this.updateConversations();
    //   });
    

  }

  ngOnChanges() {
    this.updateConversations();
    
  }

  retrievePosts() {
    this.postService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.posts = data.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 });
      this.updateConversations();
    });
        
  }

  updateConversations() {
    let filterdConversations = [];
    try {
      for (let i = 0; i < this.posts.length; i++) {
        const element = this.posts[i];
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
          _post.customIdName = element.id;
          filterdConversations.push(_post);
        }
      }
      this.conversations = filterdConversations.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
    } catch (error) {
      
    }
    

  }


  savePost(): void {
    this.post.timeStamp = new Date().getTime();
    this.post.userId = this.activeUserId;
    this.post.conversationId = this.activeConversationId;
    this.post.conversationType = this.activeConversationType;
    this.post.subPost = true;
    this.post.threadId = this.randomId();
    this.post.threadAmount = 0;
    this.post.message = this.message;
    this.postService.create(this.post).then(() => {
      this.loading = false;
      this.message = '';
      this.updateConversations();
    });
  }

  deletePost(customIdName: string) {
    console.log('postdelete',customIdName);
    this.postService.delete(customIdName).then(() => {
      this.updateConversations();
      this.threadIdChange.emit('');
    });
  }

  newPost() {
    this.post = new Post();
  }

  
  randomId() {
    return Math.random().toString(36).replace('0.', 'thread_');
  }

  openThread(threadId: string) {
    this.showThreadsChange.emit(true);
    //this.threadIdObsChange.emit(!this.threadIdObs);
    this.threadIdChange.emit(threadId);
  }


}
