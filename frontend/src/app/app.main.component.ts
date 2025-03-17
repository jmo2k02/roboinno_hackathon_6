import { Component } from '@angular/core';
import { AppMenuComponent } from "./app-menu.component";
import { AppTopbarComponent } from "./app-topbar.component";

@Component({
  selector: 'app-main',
  imports: [AppMenuComponent, AppTopbarComponent],
  templateUrl: './app.main.component.html',
  styleUrl: './app.main.component.scss'
})
export class AppMainComponent {

}
