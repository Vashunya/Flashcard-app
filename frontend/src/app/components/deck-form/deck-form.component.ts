import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/interfaces';

@Component({
  selector: 'app-deck-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './deck-form.component.html',
})
export class DeckFormComponent implements OnInit {
  categories: Category[] = [];
  form = { title: '', description: '', category: '' };
  isEdit = false;
  deckId: number | null = null;
  error = '';

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.api.getCategories().subscribe({ next: d => (this.categories = d) });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.deckId = Number(id);
      this.api.getDeck(this.deckId).subscribe({
        next: d => { this.form = { title: d.title, description: d.description, category: String(d.category) }; },
      });
    }
  }

  onSubmit() {
    if (!this.form.title || !this.form.category) { this.error = 'Title and category are required'; return; }
    const payload = { title: this.form.title, description: this.form.description, category: Number(this.form.category) };
    const req = this.isEdit ? this.api.updateDeck(this.deckId!, payload) : this.api.createDeck(payload);
    req.subscribe({
      next: deck => this.router.navigate(['/decks', deck.id]),
      error: () => (this.error = 'Failed to save deck'),
    });
  }
}