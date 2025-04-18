import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IDatamuseResponse } from './models/datamuse-response';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'datamuse';
  text: string = '';
  wordCount = 0;
  charCount = 0;
  apiService = inject(ApiService);
  destroyRef = inject(DestroyRef);
  synonyms: string[] = [];

  public countWordsAndChars(): void {
    this.charCount = this.text.length;
    this.wordCount =
      this.text.trim().length === 0 ? 0 : this.text.trim().split(/\s+/).length;
  }

  public getSynonyms(textArea: HTMLTextAreaElement): void {
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selected = textArea.value.substring(start, end).trim();

    if (!selected.trim()) {
      this.synonyms = [];
      return;
    }
    const requestText = selected.trim().split(/\s+/).join('+');
    this.apiService
      .getSynonyms(requestText)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('Error fetching synonyms:', error);
          this.synonyms = [];
          return of([]);
        })
      )
      .subscribe((options: IDatamuseResponse[]) => {
        this.synonyms = options.map((option) => option.word);
      });
  }

  public chooseWord(newWord: string, textArea: HTMLTextAreaElement): void {
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    this.text = this.text.slice(0, start) + newWord + this.text.slice(end);
    this.synonyms = [];
    this.countWordsAndChars();
  }
}
