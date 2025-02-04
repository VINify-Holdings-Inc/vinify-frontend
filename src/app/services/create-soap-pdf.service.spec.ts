import { TestBed } from '@angular/core/testing';

import { CreateSoapPdfService } from './create-soap-pdf.service';

describe('CreateSoapPdfService', () => {
  let service: CreateSoapPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateSoapPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
