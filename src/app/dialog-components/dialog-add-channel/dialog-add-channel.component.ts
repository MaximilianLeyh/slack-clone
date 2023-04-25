import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, getFirestore, collection, doc, setDoc, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Channel } from 'src/models/channels.class';
import { timestamp } from 'rxjs';
import { Post } from 'src/models/post.class';

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
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
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
