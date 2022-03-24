import { UsuariosService } from './../usuarios.service'
import { ChatService } from './../chat.service'
import { IMensaje } from './mensaje.interface'
import { ISala } from './salas.interface'
import { Component, OnInit } from '@angular/core'
import { SalasService } from '../salas.service'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatNavList } from '@angular/material/list'
import { Router } from '@angular/router'
import { Auth, User } from '@angular/fire/auth'
import { NgModule } from '@angular/core'
import { IUser } from '../usuarios/user.interface'

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css']
})
export class SalaComponent implements OnInit {
  sala: ISala = {
    id: '',
    nombre: '',
    style: ''
  }
  usuario!: User

  relleno: string[] = [
    '&nbsp;ADMINISTRACIÓN',
    '&nbsp;EDUCACIÓN',
    '&nbsp;SANIDAD',
    '&nbsp;SERVICIOS'
  ]

  salas: ISala[] = []
  mensaje: IMensaje = {
    idSala: '',
    id: '',
    usuario: '',
    avatar: '',
    texto: '',
    fechaHora: ''
  }

  mensajes: IMensaje[] = []

  constructor (
    private salasService: SalasService,
    private chatService: ChatService,
    private fireAuth: Auth,
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit (): void {
    this.getSalas()
    this.usuario = this.fireAuth.currentUser!
  }

  getSalas () {
    this.salasService.getSalas().subscribe((salas: ISala[]) => {
      this.salas = salas
      this.getMensajes(salas[0])
    })
  }
  getMensajes (sala: ISala) {
    console.log(sala)
    this.sala = sala
    this.chatService.salactiva = sala
    this.chatService
      .getMensajes(this.sala.id)
      .subscribe((mensajes: IMensaje[]) => {
        console.log(mensajes)
        this.mensajes = mensajes
      })
  }
  logout () {
    const usuario: IUser = {
      displayName: this.usuario.displayName || '',
      email: this.usuario.email || '',
      online: false
    }
    this.usuariosService.updateUsuarios(usuario)
    this.fireAuth.signOut()
    this.router.navigateByUrl('/login')
  }
}
