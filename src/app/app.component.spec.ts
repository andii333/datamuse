import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { of } from 'rxjs';
import { IDatamuseResponse } from './models/datamuse-response';
import { provideHttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    mockApiService = jasmine.createSpyObj('ApiService', ['getSynonyms']);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: mockApiService },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should count characters and words correctly', () => {
    component.text = 'hello world';
    component.countWordsAndChars();
    expect(component.charCount).toBe(11);
    expect(component.wordCount).toBe(2);
  });

  it('should count zero words if text is empty or whitespace', () => {
    component.text = '   ';
    component.countWordsAndChars();
    expect(component.wordCount).toBe(0);
    expect(component.charCount).toBe(3);
  });

  it('should get synonyms and set them', () => {
    const mockResponse: IDatamuseResponse[] = [
      { word: 'test1', score: 1000, tags: ['syn'] },
      { word: 'test2', score: 900, tags: ['syn'] },
    ];
    mockApiService.getSynonyms.and.returnValue(of(mockResponse));

    const textarea = document.createElement('textarea');
    textarea.value = 'something cool';
    textarea.selectionStart = 0;
    textarea.selectionEnd = 9;

    component.text = textarea.value;
    component.getSynonyms(textarea);

    expect(mockApiService.getSynonyms).toHaveBeenCalledWith('something');
  });

  it('should not call API if no text is selected', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'test';
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;

    component.getSynonyms(textarea);

    expect(mockApiService.getSynonyms).not.toHaveBeenCalled();
    expect(component.synonyms).toEqual([]);
  });
});
