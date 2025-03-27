import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTmDialogComponent } from './delete-tm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('DeleteTmDialogComponent', () => {
  let component: DeleteTmDialogComponent;
  let fixture: ComponentFixture<DeleteTmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTmDialogComponent],
      imports: [
        MatDialogModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteTmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
