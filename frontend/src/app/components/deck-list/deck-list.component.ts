import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Deck } from '../../models/interfaces';

@Component({
  selector: 'app-deck-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './deck-list.component.html',
})
export class DeckListComponent implements OnInit {
  decks = signal<Deck[]>([]);
  filtered = signal<Deck[]>([]);
  search = signal('');
  error = signal('');
  loading = signal(true);

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.getDecks().subscribe({
      next: d => { this.decks.set(d); this.filtered.set(d); this.loading.set(false); },
      error: () => { this.error.set('Failed to load decks'); this.loading.set(false); },
    });
  }

  onSearch() {
    const q = this.search().toLowerCase();
    this.filtered.set(this.decks().filter(d => d.title.toLowerCase().includes(q)));
  }

  delete(id: number, e: Event) {
    e.preventDefault();
    if (!confirm('Delete this deck?')) return;
    this.api.deleteDeck(id).subscribe({ next: () => this.load() });
  }
}