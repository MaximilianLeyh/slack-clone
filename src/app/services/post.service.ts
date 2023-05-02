import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Post } from 'src/models/post.class';

@Injectable({
    providedIn: 'root'
})

export class PostService {

    private dbPath = 'conversations'; //set Colletion name

    postsRef: AngularFirestoreCollection<Post> = null;  //set Colletion with type Post

    constructor(private db: AngularFirestore) {
        this.postsRef = db.collection(this.dbPath);        
    }

    getAll(): AngularFirestoreCollection<Post> {    //function that returns the complete db
        return this.postsRef;
    }

    create(post: Post): any {   //function that creates an new entry in the db
        return this.postsRef.add({...post});
    }

    update(id: string, data: any): Promise<void> {  //function that updates an entry in the db
        return this.postsRef.doc(id).update(data);
    }

    delete(id: string): Promise<void> { //function that deletes an entry in the db
        return this.postsRef.doc(id).delete();
    }

    getPost(customId: string): any {
        return this.postsRef.doc(customId);
    }
}

