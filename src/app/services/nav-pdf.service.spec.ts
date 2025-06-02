import { TestBed } from '@angular/core/testing';

import { NavPdfService } from './nav-pdf.service.ts cppppp';

describe('NavPdfService', () => {
  let service: NavPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
