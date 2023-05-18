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
  /**
   * this function retrieves posts, transforms the data, assigns it to a property (this.conversations)
   * and triggers two additional methods (updateThreads() and collectThreads()) to perform further operations on the retrieved data
   */
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

  /**
   * after changes starts again collect Threads()
   */
  ngOnChanges() {
    this.collectThreads();
  }

  /**
   * close the threadsBoard
   */
  closeThreads() {
    this.showThreadsChange.emit(false);
  }
  
  /**
   * the function creates a new array (filteredConversations) and populates it with filtered and transformed Post objects based on some condition. 
   * Then, it assigns the filtered and sorted array back to the this.conversations property, replacing the original array.
   */
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
  /**
   * the function collects conversation objects from the conversations array that have a matching threadId to the stored this.threadId.
   * It adds those conversation objects to the threads array, 
   * assigns the conversationId of the matched conversation object to the activeConversationId property, 
   * and assigns the first conversation object in the threads array to the mainThread property
   */
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

  /**
   * the function creates a new thread by creating a Post object with the necessary properties and saves it using the postService. 
   * Once the saving process is complete, it updates relevant properties and potentially triggers additional operations.
   */
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

  /**
   * he function deletes the thread with the specified customIdName using the postService. After the deletion, 
   * it collects and updates the threads, performs any necessary updates or calculations on the threads, and updates the thread count or amount.
   */
  deleteThread(customIdName: string) {
    this.postService.delete(customIdName).then(() => {
      this.collectThreads();
      this.updateThreads();
      this.setThreadAmount();
    });
  }

  /**
   * The function opens a dialog window for editing a thread. 
   * It passes the post object and the activeUserId as data to the dialog window component (DialogEditPostComponent), allowing it to access and modify the thread information.
   */
  editThread(post: Post) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { post: post, userName: this.activeUserId }
    this.dialog.open(DialogEditPostComponent, dialogConfig);
  }

  /**
   * The function updates the threadAmount property of the main thread in the postService with the number of threads stored in the threads array. 
   * This ensures that the main thread reflects the correct count of threads associated with it.
   */
  setThreadAmount() {
    if (this.threads.length > 0) {
      this.postService.update(this.mainThread.customIdName, { threadAmount: this.threads.length });
    }
  }
}
