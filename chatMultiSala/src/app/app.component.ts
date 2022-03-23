import { UsuariosComponent } from './usuarios/usuarios.component'
import { Component } from '@angular/core'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { SalaComponent } from './sala/sala.component'
import { ChatComponent } from './chat/chat.component'
import { LoginComponent } from './login/login.component'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatMultiSala'
}
