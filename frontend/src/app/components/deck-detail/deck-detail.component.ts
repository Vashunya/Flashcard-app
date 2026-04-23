import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Deck } from '../../models/interfaces';

@Component({
  selector: 'app-deck-detail',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './deck-detail.component.html',
})
export class DeckDetailComponent implements OnInit {
  deck = signal<Deck | null>(null);
  error = signal('');
  showForm = signal(false);
  newCard = signal({ question: '', answer: '' });

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.load(Number(this.route.snapshot.paramMap.get('id')));
  }

  load(id: number) {
    this.api.getDeck(id).subscribe({
      next: d => this.deck.set(d),
      error: () => this.error.set('Failed to load'),
    });
  }

  addCard() {
    const d = this.deck();
    const card = this.newCard();
    if (!d || !card.question || !card.answer) return;
    this.api.createFlashcard(d.id, { ...card, deck: d.id }).subscribe({
      next: () => { this.newCard.set({ question: '', answer: '' }); this.showForm.set(false); this.load(d.id); },
      error: () => this.error.set('Failed to add card'),
    });
  }

  deleteCard(cardId: number) {
    if (!confirm('Delete this card?')) return;
    this.api.deleteFlashcard(cardId).subscribe({ next: () => this.load(this.deck()!.id) });
  }
}