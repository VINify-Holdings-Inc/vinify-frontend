import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleVinComponent } from './single-vin.component';

describe('SingleVinComponent', () => {
  let component: SingleVinComponent;
  let fixture: ComponentFixture<SingleVinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleVinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleVinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
