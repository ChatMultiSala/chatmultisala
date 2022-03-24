import { Component, OnInit } from '@angular/core'
import { UsuariosService } from '../usuarios.service'
import { IUser } from './user.interface'
import { SalasService } from '../salas.service'

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  user: IUser = {
    id: '',
    email: '',
    displayName: '',
    password: ''
  }
  usuarios: IUser[] = []
  constructor (private usuariosService: UsuariosService) {}

  ngOnInit (): void {
    this.usuariosService.getUsuarios().subscribe((usuarios: IUser[]) => {
      this.usuarios = usuarios
      console.log(usuarios)
    })
  }
}
