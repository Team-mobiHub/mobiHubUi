import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropZoneComponent } from './drop-zone.component';
import { MatIconModule } from '@angular/material/icon';

describe('DropZoneComponent', () => {
  let component: DropZoneComponent;
  let fixture: ComponentFixture<DropZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropZoneComponent],
      imports: [
        MatIconModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DropZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
