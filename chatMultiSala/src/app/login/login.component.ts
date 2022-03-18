import { Component, OnInit } from '@angular/core'
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth'
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
  constructor (private fireAuth: Auth, private router: Router) {}

  ngOnInit (): void {}

  async loginGoogle () {
    const credenciales = await signInWithPopup(
      this.fireAuth,
      new GoogleAuthProvider()
    )
    localStorage.setItem('usuario', JSON.stringify(credenciales.user))
    this.router.navigateByUrl('chat')
  }
}
