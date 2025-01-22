import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleComparisonComponent } from './title-comparison.component';

describe('TitleComparisonComponent', () => {
  let component: TitleComparisonComponent;
  let fixture: ComponentFixture<TitleComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
