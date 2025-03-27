import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRatingComponent } from './star-rating.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { InteractionService } from '../../traffic-model/shared/interaction.service';
import { of } from 'rxjs';
import { RatingDto } from '../dtos/rating-dto';

describe('StarRatingComponent', () => {
  let component: StarRatingComponent;
  let fixture: ComponentFixture<StarRatingComponent>;

  beforeEach(async () => {
    const interactionServiceMock = jasmine.createSpyObj('InteractionService', ['getAverageRating']);
    interactionServiceMock.getAverageRating.and.returnValue(of({ averageRating: 4.5 }));


    await TestBed.configureTestingModule({
      declarations: [StarRatingComponent],
      imports: [
        HttpClientTestingModule,
        MatIconModule
      ],
      providers: [
        { provide: InteractionService, useValue: interactionServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StarRatingComponent);
    component = fixture.componentInstance;

    // Mock input rating
    component.rating = {
      trafficModelId: 1,
      usersRating: 0,
      averageRating: 4.5
    } as RatingDto;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
