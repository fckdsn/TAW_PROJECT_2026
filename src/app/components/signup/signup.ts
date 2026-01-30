import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.html'
})
export class SignupComponent {

  credentials = {
    login: '',
    email: '',
    password: '',
    name: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  create(): void {
    this.authService.createOrUpdate(this.credentials).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {}
    });
  }
}
