import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Post } from 'src/models/post.class';
import { HomeComponent } from '../home/home.component';
import { PostService } from '../services/post.service';
import { Times } from 'src/models/time.class';
import { map } from 'rxjs';
import { DialogEditPostComponent } from '../dialog-components/dialog-edit-post/dialog-edit-post.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';


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
  @Input() isMobile: boolean;
  emptyInput: string = '';
  conversations: Post[] = [];
  times: Times = new Times;
  @Input() searchString = '';
  memActiveConversationId = '';
  hidePostOverview = false;


  constructor(private postService: PostService, public home: HomeComponent, public dialog: MatDialog) { }



  ngOnInit(): void {
    this.retrievePosts();
   
  }

  ngOnChanges() {
    if((this.searchString.length == 0)){
      if(this.activeConversationId.includes('search'))this.activeConversationId = this.memActiveConversationId;
      this.updateConversations();
      }
    else this.showFiltered();
    if(this.isMobile && !this.showThreads) this.hidePostOverview = false;
    if(!this.isMobile && this.hidePostOverview) this.hidePostOverview = false;
    if(this.isMobile && this.showThreads) this.hidePostOverview = true;
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
    this.postService.delete(customIdName).then(() => {
      this.updateConversations();
      this.threadIdChange.emit('');
    });
  }

  editPost(post: Post){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { post: post, userName: this.activeUserId }
    this.dialog.open(DialogEditPostComponent, dialogConfig);
  }

  newPost() {
    this.post = new Post();
  }

  
  randomId() {
    return Math.random().toString(36).replace('0.', 'thread_');
  }

  openThread(threadId: string) {
    this.showThreadsChange.emit(true);
    this.threadIdChange.emit(threadId);
  }

  showFiltered(){
    if(this.searchString.length > 0){
      if(!(this.activeConversationId.includes('search')))this.memActiveConversationId = this.activeConversationId;
      this.activeConversationId = 'search for...:' + this.searchString;
      let filterdConversations = [];
      this.posts.forEach(post => {
        const message:string = post.message.toString();
        const name:string = post.userId.toString();
        const searchString = this.searchString.toLocaleLowerCase();
      if(message.toLowerCase().includes(searchString) || name.toLocaleLowerCase().includes(searchString)) filterdConversations.push(post);
      this.conversations = filterdConversations.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
    });

    }

  }

}
