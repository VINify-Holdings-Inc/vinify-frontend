import { TestBed } from '@angular/core/testing';

import { TitleReportService } from './title-report.service';

describe('TitleReportService', () => {
  let service: TitleReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
