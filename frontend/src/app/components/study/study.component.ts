import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Deck, Flashcard } from '../../models/interfaces';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [],
  templateUrl: './study.component.html',
})
export class StudyComponent implements OnInit {
  deck = signal<Deck | null>(null);
  cards = signal<Flashcard[]>([]);
  idx = signal(0);
  revealed = signal(false);
  correct = signal(0);
  done = signal(false);
  error = signal('');

  constructor(private api: ApiService, private route: ActivatedRoute, public router: Router) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getDeck(id).subscribe({
      next: d => { this.deck.set(d); this.cards.set(d.cards); },
      error: () => this.error.set('Failed to load deck'),
    });
  }

  reveal() { this.revealed.set(true); }

  answer(ok: boolean) {
    if (ok) this.correct.update(c => c + 1);
    this.revealed.set(false);
    if (this.idx() < this.cards().length - 1) {
      this.idx.update(i => i + 1);
    } else {
      this.done.set(true);
      this.api.saveStudyLog(this.deck()!.id, this.correct()).subscribe();
    }
  }

  restart() { this.idx.set(0); this.correct.set(0); this.done.set(false); this.revealed.set(false); }

  current() { return this.cards()[this.idx()]; }
  progress() { return this.cards().length ? Math.round((this.idx() / this.cards().length) * 100) : 0; }
  pct() { return this.cards().length ? Math.round((this.correct() / this.cards().length) * 100) : 0; }
}