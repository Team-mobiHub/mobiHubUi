import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficModelListItemComponent } from './traffic-model-list-item.component';

describe('TrafficModelListItemComponent', () => {
  let component: TrafficModelListItemComponent;
  let fixture: ComponentFixture<TrafficModelListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrafficModelListItemComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrafficModelListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
