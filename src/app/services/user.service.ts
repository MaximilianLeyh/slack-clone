import { Injectable } from '@angular/core';
import { docData, Firestore, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { collection, onSnapshot } from '@firebase/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser$: Observable<any>;
  currentUser: any;
  users: any = [];
  userRef: any = collection(this.firestore, 'users');
  userRef2: AngularFirestoreCollection = null;  //set Colletion with type Post

  /**
   * the function sets up the this.currentUser$ observable that emits the current user's data from the database by using the switchMap() 
   * operator to get the current user's ID from the AuthService and then using the docData() method to get the user's data from the Firestore database
   */
  constructor(
    private db: AngularFirestore,
    public authService: AuthService,
    private firestore: Firestore) {
    this.userRef2 = db.collection('users');
    onSnapshot(collection(this.firestore, 'users'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          this.users.push({ ...(change.doc.data() as object), id: change.doc.id });
        } else if (change.type === 'modified') {
          let userToEdit = this.users.filter(m => m.id == change.doc.id);
          userToEdit[0]['loggedIn'] = change.doc.data()['loggedIn'];
        }
      })
    },
      (error) => {
        console.warn('Loading all users error', error);
      })


    this.authService.loggedUser?.subscribe((user$) => {
      if (user$) {
        getDoc(doc(this.userRef, user$.uid as string))
          .then((user) => {
            this.currentUser = user.data();
          })
      }
    })


    this.currentUser$ = this.authService.loggedUser.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<any>
      })
    )
  }

  /**
   * This function retrieves all the documents from the userRef collection in the Firestore database. It uses the getDocs() function from the Firestore library to perform the query.
   */
  getData() {
    getDocs(this.userRef);
  }

  /**
   *This function updates the profile image of the current user in the Firestore database by calling the update() method on the userRef2 collection reference. 
    It takes a string parameter img, which is the URL of the new image to set, and returns a Promise that resolves when the update is complete.
   */
  setImg(img: string) {
    return this.userRef2.doc(this.currentUser.id).update({ 'profileImg': img });
  }

  getUsers() {
    let users: string[] = [];
    this.users.forEach(user => {
      users.push(user.userName)
    });
    return users;
  }
}