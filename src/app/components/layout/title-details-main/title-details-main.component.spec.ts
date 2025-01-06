import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleDetailsMainComponent } from './title-details-main.component';

describe('TitleDetailsMainComponent', () => {
  let component: TitleDetailsMainComponent;
  let fixture: ComponentFixture<TitleDetailsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleDetailsMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleDetailsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
