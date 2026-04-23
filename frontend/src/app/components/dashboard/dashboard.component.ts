import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Stats } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  stats: Stats | null = null;
  error = '';

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    this.api.getStats().subscribe({
      next: d => (this.stats = d),
      error: () => (this.error = 'Failed to load stats'),
    });
  }
}