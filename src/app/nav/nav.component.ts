import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { AuthService } from "../services";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent implements OnInit {

  menuOpen: boolean = false

  constructor(public auth: AuthService,  private router: Router) { 
    router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationEnd) {
        this.menuOpen = false
      }
    })
  }

  ngOnInit() {
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.toggleMenu()
    this.auth.logout()
  }

  login() {
    this.toggleMenu()
    this.auth.login()
  }

}
