import { Component, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LinkDirective } from '../modules/shared/directives/link.directive';

type NavItem = {
name: string;
icon: string;
link: UrlTree;
}

@Component({
  selector: 'app-menu',
  imports: [LinkDirective],
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.scss'
})
export class AppMenuComponent {
private router = inject(Router);

items: NavItem[] = [
  {
    name: "Draw",
    icon: "draw",
    link: this.router.createUrlTree([`draw`])
  },
  {
    name: "SVG upload",
    icon: "upload_file",
    link: this.router.createUrlTree(['upload'])
  }
] 

}
