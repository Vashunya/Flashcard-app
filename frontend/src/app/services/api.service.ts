import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Deck, Flashcard, Stats } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private api = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getStats():                          Observable<Stats>       { return this.http.get<Stats>(`${this.api}/stats/`); }
  getCategories():                     Observable<Category[]>  { return this.http.get<Category[]>(`${this.api}/categories/`); }
  getDecks():                          Observable<Deck[]>      { return this.http.get<Deck[]>(`${this.api}/decks/`); }
  getDeck(id: number):                 Observable<Deck>        { return this.http.get<Deck>(`${this.api}/decks/${id}/`); }
  createDeck(d: Partial<Deck>):        Observable<Deck>        { return this.http.post<Deck>(`${this.api}/decks/`, d); }
  updateDeck(id: number, d: Partial<Deck>): Observable<Deck>  { return this.http.put<Deck>(`${this.api}/decks/${id}/`, d); }
  deleteDeck(id: number):              Observable<void>        { return this.http.delete<void>(`${this.api}/decks/${id}/`); }
  createFlashcard(deckId: number, c: Partial<Flashcard>): Observable<Flashcard> {
    return this.http.post<Flashcard>(`${this.api}/decks/${deckId}/cards/`, c);
  }
  deleteFlashcard(id: number):         Observable<void>        { return this.http.delete<void>(`${this.api}/cards/${id}/`); }
  saveStudyLog(deck: number, score: number): Observable<any>   { return this.http.post(`${this.api}/study-logs/`, { deck, score }); }
}