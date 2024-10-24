import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {
  constructor(private router: Router) {}

  login() {
  
    console.log('Navegar al login');
    this.router.navigate(['/login']);
  }
  
  openUrl(url: string) {
    window.open(url, '_balck');
  }
  navigateToRegister() {
    this.router.navigate(['/registro']); 
  }
}
