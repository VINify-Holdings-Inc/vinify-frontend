import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExportComponent } from './get-recent-alert-file-export.component';

describe('FileExportComponent', () => {
  let component: FileExportComponent;
  let fixture: ComponentFixture<FileExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
