import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAdditionalComponent } from './summary-additional.component';

describe('SummaryAdditionalComponent', () => {
  let component: SummaryAdditionalComponent;
  let fixture: ComponentFixture<SummaryAdditionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryAdditionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
