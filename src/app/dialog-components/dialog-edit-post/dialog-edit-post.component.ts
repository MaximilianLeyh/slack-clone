import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/models/post.class';

@Component({
  selector: 'app-dialog-edit-post',
  templateUrl: './dialog-edit-post.component.html',
  styleUrls: ['./dialog-edit-post.component.scss']
})
export class DialogEditPostComponent implements OnInit {
  userName: string = '';
  customIdName: string = '';
  loading: boolean = false;
  post: Post;
  message = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data, private postService: PostService) {
    this.userName = data.userName;
    this.post = data.post;

  }

  ngOnInit(): void {
    this.message = this.post.message;
  }

  /**
   * this function saves an edit made to a post by calling the update method of the postService object with the post's customIdName and the updated message as parameters. 
   * It handles potential errors by logging them to the console.
   */
  saveEdit(){
    this.postService.update(this.post.customIdName, {message: this.message})
    .then(()=> {
    })
    .catch(err => console.log(err)
    );
  }
}
