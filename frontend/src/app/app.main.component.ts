import { Component } from '@angular/core';
import { AppMenuComponent } from "./app-menu.component";
import { AppTopbarComponent } from "./app-topbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [AppMenuComponent, AppTopbarComponent, RouterOutlet],
  templateUrl: './app.main.component.html',
  styleUrl: './app.main.component.scss'
})
export class AppMainComponent {

}
