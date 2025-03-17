import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppMainComponent } from "./app.main.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppMainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
