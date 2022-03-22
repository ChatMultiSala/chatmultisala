import { Injectable } from '@angular/core'

import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  where,
  query
} from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { IMensaje } from './sala/mensaje.interface'
import { ISala } from './sala/salas.interface'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  salactiva!: ISala
  constructor (private firestore: Firestore) {}

  /* getMensajes (): Observable<IMensaje[]> {
    const mensajes = collection(this.firestore, 'mensajes')
    return collectionData(mensajes, { idField: 'id' }) as Observable<IMensaje[]>
  }*/

  addMensaje (mensaje: IMensaje) {
    const mensajes = collection(this.firestore, 'mensajes')
    return addDoc(mensajes, mensaje)
  }
  getMensajes (idSala?: string): Observable<IMensaje[]> {
    const mensajes = collection(this.firestore, 'mensajes')
    console.log(mensajes)
    const mensajeSala = query(mensajes, where('idSala', '==', idSala))
    return collectionData(mensajeSala, { idField: 'id' }) as Observable<
      IMensaje[]
    >
  }
}
