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

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css']
})
export class SalaComponent implements OnInit {
  sala: ISala = {
    id: '',
    nombre: ''
  }

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
    private chatService: ChatService
  ) {}

  ngOnInit (): void {
    this.getSalas()
  }

  getSalas () {
    this.salasService.getSalas().subscribe((salas: ISala[]) => {
      this.salas = salas
      console.log(salas)
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
}
