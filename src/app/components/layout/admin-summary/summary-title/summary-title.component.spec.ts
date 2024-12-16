import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTitleComponent } from './summary-title.component';

describe('SummaryTitleComponent', () => {
  let component: SummaryTitleComponent;
  let fixture: ComponentFixture<SummaryTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
