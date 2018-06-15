import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['lists'])
    }
  }

  login() {
    this.auth.login()
  }

}
