import { Component, OnInit } from '@angular/core'
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from '@angular/fire/auth'
import { ConfirmationService } from 'primeng/api'
import swal from'sweetalert2';
import { Router } from '@angular/router'
import { MatFormFieldModule } from '@angular/material/form-field'
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators
} from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: string = ''
  password: string = ''
  newUser: string = ''
  newPassword: string = ''
  constructor (
    private fireAuth: Auth,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit (): void {}

  async loginGoogle () {
    const credenciales = await signInWithPopup(
      this.fireAuth,
      new GoogleAuthProvider()
    )
    localStorage.setItem('usuario', JSON.stringify(credenciales.user))
    this.router.navigateByUrl('sala')
  }

  async login () {
    try {
      await signInWithEmailAndPassword(this.fireAuth, this.user, this.password)
      this.router.navigateByUrl('sala')
    } catch (error) {
      console.log(error)
      this.confirmationService.confirm({
        message: 'Usuario y/o contraseña erróneos',
        header: 'Error',
        icon: 'pi pi-exclamation-triangle'
      })
    }
  }

  async signUp () {
    try {
      await createUserWithEmailAndPassword(
        this.fireAuth,
        this.newUser,
        this.newPassword
      )
      this.confirmationService.confirm({
        message: 'Usuario creado con éxito',
        header: 'Ok',
        icon: 'pi pi-exclamation-triangle'
      })
    } catch (error) {
      console.log(error)
      this.confirmationService.confirm({
        message: 'Usuario y/o contraseña erróneos',
        header: 'Error',
        icon: 'pi pi-exclamation-triangle'
      })
    }
  }
}
