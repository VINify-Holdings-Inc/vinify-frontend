import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertTableMainComponent } from './alert-table-main.component';

describe('AlertTableMainComponent', () => {
  let component: AlertTableMainComponent;
  let fixture: ComponentFixture<AlertTableMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertTableMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertTableMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
