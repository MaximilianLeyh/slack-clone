import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post } from 'src/models/post.class';
import { HomeComponent } from '../home/home.component';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})

export class ThreadsComponent implements OnInit {
  @Input() showThreads = false;
  @Input() threadIdBool: boolean;
  @Output() showThreadsChange = new EventEmitter<boolean>();
  conversations: Post[] = [];
  threads: Post[] = [];
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


  constructor(private firstore: AngularFirestore, public home: HomeComponent) { }

  ngOnInit(): void {
    this.firstore
      .collection('conversations')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((changes: any) => {
        this.allPosts = changes;
        this.conversations = changes.sort((a, b) => { return a.timeStamp >= b.timeStamp ? 1 : -1 })
        this.updateThreads();
        this.collectThreads();
      });
  }

  ngOnChanges() {
    this.collectThreads();
    this.setThreadAmount();
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
        _post.customIdName = element.customIdName;
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
    this.post.threadAmount = this.threads.length;
    // this.firstore
    //   .collection('conversations')
    //   .add(this.post.toJSON())
    //   .then((result: any) => {
    //     this.loading = false;
    //     this.message = '';
    //   });
  }

  setThreadAmount() {
    this.threads.forEach(thread => {
      thread.threadAmount = this.threads.length;
      // this.firstore
      //   .collection('conversations')
      //   .doc(thread.customIdName)
      //   .update(thread.toJSON());
    });


  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth < 600) {
      this.showThreads = false;
    } else {
      this.showThreads = true;
    }
  }

}
