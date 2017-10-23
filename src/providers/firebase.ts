import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FirebaseProvider {

  constructor(public afs: AngularFirestore) { }

  getObject(document) {
    return this.afs.doc(document);
  }

  getList(document) {
    return this.afs.collection(document);
  }

  addItem(document, item) {
    return this.afs.collection(document).add(item);
  }

  removeItem(document, key) {
    return this.afs.collection(document).doc(key).delete();
  }

  updateItem(document, data) {
    return this.afs.doc(document).update(data);
  }

  query(document, options) {
    return this.afs.collection(document, options)
  }
}
