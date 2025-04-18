import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';

interface IDatamuseResponse {
  word: string;
  score: number;
  tags: string[];
}

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return synonyms for a given word', () => {
    const mockResponse: IDatamuseResponse[] = [
      { word: 'example', score: 100, tags: ['noun'] },
      { word: 'sample', score: 95, tags: ['noun'] },
    ];

    const testText = 'exam';

    service.getSynonyms(testText).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `https://api.datamuse.com/words?ml=${testText}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
