import { TestBed } from '@angular/core/testing';

import { DateUtilServiceService } from './date-util-service.service';

describe('DateUtilServiceService', () => {
  let service: DateUtilServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateUtilServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
