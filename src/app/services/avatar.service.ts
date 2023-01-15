import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, doc, docData, Firestore, setDoc, collection, collectionData,deleteDoc ,updateDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';

/*export interface Registro {
  id?: string;
  title: string;
  text: string;
}*/

export interface Registro {
  id?: string;
  name: string;
  idCard: number;
  familyMembers: number;
  latitud: number;
  longitud: number;
  // location: GeoPoint;
}

@Injectable({
  providedIn: 'root',
})

export class AvatarService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) { }

  getNotes(): Observable<Registro[]> {
    const notesRef = collection(this.firestore, 'Censados');
    return collectionData(notesRef, { idField: 'id'}) as Observable<Registro[]>;
  }
  updateNote(registro: Registro) {
    const noteDocRef = doc(this.firestore, `Censados/${registro.id}`);
    return updateDoc(noteDocRef, { name: registro.name,idCard:registro.idCard,familyMembers:registro.familyMembers,latitud:registro.latitud,longitud:registro.longitud });
  }

  deleteNote(registro: Registro) {
    const noteDocRef = doc(this.firestore, `Censados/${registro.id}`);
    return deleteDoc(noteDocRef);
  }

  getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocRef);
  }
  getNoteById(id): Observable<Registro> {
    const noteDocRef = doc(this.firestore, `Censados/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<Registro>;
  }

  addRegister(registro: Registro) {
    //setDoc()
    const notesRef = collection(this.firestore, 'Censados');
    console.log("REGISTRANDO USUARIO . . . . .")
    return addDoc(notesRef, registro);
  }

  async uploadImage(cameraFile: Photo) {
    const user = this.auth.currentUser;
    const path = `uploads/${user.uid}/CasaCensada.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, {
        imageUrl,
      });
      return true;
    } catch (e) {
      return null;
    }
  }
}