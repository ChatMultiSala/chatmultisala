import { ISala } from './salas.interface'
import{Imensa}
import { Component, OnInit } from '@angular/core'
import { SalasService } from '../salas.service'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
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
  mensajes: IMensajes = {
    idsala: '',
    nombre: ''
  }

  mensajes: IMensajes[] = []

  constructor (private salasService: SalasService) {}

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
    this.idsala = sala.id
    this.mensajesService
      .getMensajes(this.idsala)
      .subscribe((productos: IMensajes[]) => {
        this.mensajes = mensajes
      })
  }
}
