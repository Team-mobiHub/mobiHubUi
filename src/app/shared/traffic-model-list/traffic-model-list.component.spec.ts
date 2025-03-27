import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficModelListComponent } from './traffic-model-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

describe('TrafficModelListComponent', () => {
  let component: TrafficModelListComponent;
  let fixture: ComponentFixture<TrafficModelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrafficModelListComponent],
      imports: [
        HttpClientTestingModule,
        MatPaginatorModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatCardModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrafficModelListComponent);
    component = fixture.componentInstance;

    component.trafficModels = []

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
