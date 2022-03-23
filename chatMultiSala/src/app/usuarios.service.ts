import { Injectable } from '@angular/core'
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
  query,
  where
} from '@angular/fire/firestore'
import { user } from 'rxfire/auth'
import { Observable } from 'rxjs'
import { IUser } from './usuarios/user.interface'
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor (private firestore: Firestore) {}

  getUsuarios (): Observable<IUser[]> {
    const usuarios = collection(this.firestore, 'usuarios')
    return collectionData(usuarios, { idField: 'id' }) as Observable<IUser[]>
  }

  updateUsuarios (usuario: IUser) {
    const usuarios = collection(this.firestore, 'usuarios')

    const usuarioemail = doc(this.firestore, 'usuarios', usuario.email)

    if (usuarioemail) {
      return setDoc(usuarioemail, usuario)
    } else {
      return addDoc(usuarios, usuario)
    }
  }
}
