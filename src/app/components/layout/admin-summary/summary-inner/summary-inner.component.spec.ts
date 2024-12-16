import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryInnerComponent } from './summary-inner.component';

describe('SummaryInnerComponent', () => {
  let component: SummaryInnerComponent;
  let fixture: ComponentFixture<SummaryInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryInnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
