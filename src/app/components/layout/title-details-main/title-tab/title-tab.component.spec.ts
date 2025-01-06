import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleTabComponent } from './title-tab.component';

describe('TitleTabComponent', () => {
  let component: TitleTabComponent;
  let fixture: ComponentFixture<TitleTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
