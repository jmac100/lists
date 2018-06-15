import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";

@Injectable()
export class FirebaseService {

  listCollection: AngularFirestoreCollection<string>
  itemCollection: AngularFirestoreCollection<string>
  masterItemCollection: AngularFirestoreCollection<string>
  items: Observable<any[]>
  itemDoc: AngularFirestoreDocument<any>;

  constructor(public afs: AngularFirestore) {
    this.listCollection = this.afs.collection('lists', ref => ref.orderBy('location', 'asc'))
    this.masterItemCollection = this.afs.collection('master-list')
  }

  getLists() {
    return this.listCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data()
        data.id = a.payload.doc.id
        return data
      });
    });
  }

  getItems(id) {
    this.itemDoc = this.afs.doc<any>('lists/' + id);
    return this.itemDoc.valueChanges();
  }

  getMasterList() {
    return this.masterItemCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data()
        data.id = a.payload.doc.id
        return data
      });
    });
  }

  updateSortOrder(id, location, isLocked, items, disabledItems, isDefault) {
    const itemDocRef = this.afs.collection("lists").doc(id)
    itemDocRef.set({ items: items, disabledItems: disabledItems, location: location, isLocked: isLocked, isDefault: isDefault })
  }

  addList(item) {
    this.listCollection.add(item)    
  }

  addItem(id, location, isLocked, items, disabledItems, isDefault) {
    const itemDocRef = this.afs.collection("lists").doc(id)
    itemDocRef.set({ items: items, disabledItems: disabledItems, location: location, isLocked: isLocked, isDefault: isDefault })
  }

  removeList(id) {
    const itemRef = this.afs.collection('lists').doc(id)
    itemRef.delete()
  }

  updateMaster(id, items) {
    const itemRef = this.afs.collection('master-list').doc(id)
    itemRef.set({items})
  }
}
