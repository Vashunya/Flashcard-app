import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  mode = signal<'login' | 'register'>('login');
  username = signal('');
  password = signal('');
  email = signal('');
  error = signal('');
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.username() || !this.password()) { this.error.set('Please fill in all fields'); return; }
    this.error.set('');
    this.loading.set(true);
    const obs = this.mode() === 'login'
      ? this.auth.login(this.username(), this.password())
      : this.auth.register(this.username(), this.password(), this.email());

    obs.subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => { this.error.set(err.error?.error || 'Something went wrong'); this.loading.set(false); },
    });
  }

  toggle() { this.mode.set(this.mode() === 'login' ? 'register' : 'login'); this.error.set(''); }
}