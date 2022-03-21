import { IMensaje } from './sala/mensaje.interface'
import { Injectable } from '@angular/core'
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  doc,
  deleteDoc,
  setDoc
} from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { ISala } from './sala/salas.interface'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'

@Injectable({
  providedIn: 'root'
})
export class SalasService {
  constructor (private firestore: Firestore) {}

  getSalas (): Observable<ISala[]> {
    const salas = collection(this.firestore, 'salas')
    return collectionData(salas, { idField: 'id' }) as Observable<ISala[]>
  }
}
