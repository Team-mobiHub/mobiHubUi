import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptTmOwnershipComponent } from './accept-tm-ownership.component';

describe('AcceptTmOwnershipComponent', () => {
  let component: AcceptTmOwnershipComponent;
  let fixture: ComponentFixture<AcceptTmOwnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptTmOwnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptTmOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
