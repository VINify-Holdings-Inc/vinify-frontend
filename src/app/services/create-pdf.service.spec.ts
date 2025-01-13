import { TestBed } from '@angular/core/testing';

import { CreatePDFService } from './create-pdf.service';

describe('CreatePDFService', () => {
  let service: CreatePDFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePDFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
