import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Channel } from 'src/models/channels.class';
import { timestamp } from 'rxjs';
import { Post } from 'src/models/post.class';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-dialog-add-channel',
  templateUrl: './dialog-add-channel.component.html',
  styleUrls: ['./dialog-add-channel.component.scss']
})
export class DialogAddChannelComponent implements OnInit {
  loading = false;
  post = new Post();
  activeUserId = 'addComponente';
  conversationType = '';

  constructor(
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * his function creates a new conversation by initializing a Post object with various properties, 
   * including the conversation type, user ID, timestamp, and message. The postService is then used to create and store the conversation post.
   */
  createConversation(conversationType: string) {
    this.loading = true;
    let post = new Post();
    post.timeStamp = new Date().getTime();
    post.userId = this.activeUserId;
    post.conversationId = this.post.conversationId;
    post.conversationType = conversationType;
    post.subPost = false;
    post.subThread = false;
    post.message = this.post.message;
    this.postService.create(post);
    
  
  }
}
