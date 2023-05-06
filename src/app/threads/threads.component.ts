import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, HostListener, OnChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/models/post.class';
import { HomeComponent } from '../home/home.component';
import { Subject } from 'rxjs/internal/Subject';
import { map } from 'rxjs';
import { PostService } from '../services/post.service';
import { Times } from 'src/models/time.class';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogEditPostComponent } from '../dialog-components/dialog-edit-post/dialog-edit-post.component';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})

export class ThreadsComponent implements OnInit, OnChanges {
  @Input() showThreads = false;
  @Input() threadIdBool: boolean;
  @Output() showThreadsChange = new EventEmitter<boolean>();
  conversations: any = [];
  threads: any;
  allPosts: any;
  headerTitle: string = '# filledFromDB';
  loading: boolean = false;
  message: string = '';
  post: Post;
  @Input() activeUserId: string = '';
  activeConversationId: string = '';
  @Input() activeConversationType: string = '';
  @Input() threadId: string = '';
  postId: string;
  mainThread: Post = new Post;
  times: Times = new Times;
  @Input() isMobile = false;

  constructor(private postService: PostService, public home: HomeComponent, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.retrievePosts();
    this.collectThreads();
  }

  retrievePosts() {
    this.postService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.conversations = data;
      this.updateThreads();
      this.collectThreads();
    });

  }

  ngOnChanges() {
    this.collectThreads();
  }


  closeThreads() {
    this.showThreadsChange.emit(false);
  }

  updateThreads() {
    let filterdConversations = [];
    for (let i = 0; i < this.conversations.length; i++) {
      const element = this.conversations[i];
      if (true) {
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
  }

  collectThreads() {
    this.threads = [];
    this.conversations.forEach(conv => {
      if (conv.threadId === this.threadId) {
        this.threads.push(conv);
        this.activeConversationId = conv.conversationId;
      }
      this.mainThread = this.threads[0];
    });
  }


  saveThread() {
    this.loading = true;
    this.post = new Post();
    this.post.timeStamp = new Date().getTime();
    this.post.userId = this.activeUserId;
    this.post.conversationId = this.activeConversationId;
    this.post.conversationType = 'thread';
    this.post.subPost = true;
    this.post.message = this.message;
    this.post.threadId = this.threadId;
    this.post.subThread = true;
    this.postService.create(this.post)
      .then(() => {
        this.loading = false;
        this.message = '';
        this.setThreadAmount();
      });
  }

  deleteThread(customIdName: string) {
    this.postService.delete(customIdName).then(() => {
      this.collectThreads();
      this.updateThreads();
      this.setThreadAmount();
    });
  }

  editThread(post: Post) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { post: post, userName: this.activeUserId }
    this.dialog.open(DialogEditPostComponent, dialogConfig);
  }

  setThreadAmount() {
    if (this.threads.length > 0) {
      this.postService.update(this.mainThread.customIdName, { threadAmount: this.threads.length });
    }
  }
}
