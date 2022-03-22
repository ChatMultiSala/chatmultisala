import { IMensaje } from './../sala/mensaje.interface'
import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Auth, User } from '@angular/fire/auth'
import { ChatService } from '../chat.service'

import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators
} from '@angular/forms'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  textoMensaje: string = ''
  usuario!: User
  mensajes: IMensaje[] = []

  constructor (
    private fireAuth: Auth,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit (): void {
    this.usuario = this.fireAuth.currentUser!
    if (!this.usuario) {
      this.router.navigateByUrl('login')
    }
  }

  async enviarMensaje () {
    console.log(this.usuario)
    const mensaje: IMensaje = {
      usuario: this.usuario.email!,
      texto: this.textoMensaje,
      avatar: this.usuario.photoURL!,
      fechaHora: new Date(),
      idSala: this.chatService.salactiva.id
    }
    await this.chatService.addMensaje(mensaje)
    this.textoMensaje = ''
  }
}
