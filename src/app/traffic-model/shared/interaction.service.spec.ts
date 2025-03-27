import { TestBed } from '@angular/core/testing';

import { InteractionService } from './interaction.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrafficModelDto } from '../../shared/dtos/traffic-model-dto';
import { Framework } from '../../shared/enums/framework';
import { CommentDto } from '../../shared/dtos/comment-dto';

const dummyFavorites: TrafficModelDto[] = [
  {
    id: 1,
    name: 'Dummy Traffic Model',
    description: 'This is a dummy traffic model DTO for testing purposes.',
    userId: 1,
    teamId: undefined,
    isVisibilityPublic: true,
    dataSourceUrl: 'https://www.example.com',
    characteristics: [],
    framework: Framework.CUBE,
    region: 'Dummy Region',
    coordinates: null,
    imageURLs: ['https://www.example.com/image1', 'https://www.example.com/image2'],
    zipFileToken: '264852e6-6324-4bfd-aad3-281bd72a6aba',
    isFavorite: true,
    rating: {
      trafficModelId: 1,
      averageRating: 3.5,
      usersRating: 4
    },
    comments: [],
    markdownFileURL: ''
  }
];

const dummyComment: CommentDto = {
  id: 1,
  trafficModelId: 1,
  userId: 1,
  content: 'lorem ipsum',
  userName: 'Test User',
  creationDate: new Date('2021-01-01T00:00:00')
}

/**
 * Tests for the InteractionService class.
 */
describe('InteractionService', () => {
  let service: InteractionService;
  let httpController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(InteractionService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should add a favorite successfully', () => {
    // Arrange
    const trafficModelId = 1;

    // Act
    service.addFavorite(trafficModelId).subscribe(response => {
      // Assert
      expect(response).toBeTruthy();
    });

    const req = httpController.expectOne(`${service.favoriteUrl}/${trafficModelId}`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should handle error when adding a favorite', () => {
    // Arrange
    const trafficModelId = 1;
    const errorMessage = 'Failed to add favorite';

    // Act
    service.addFavorite(trafficModelId).subscribe(
      () => fail('expected an error, not a success'),
      error => {
        // Assert
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      }
    );

    const req = httpController.expectOne(`${service.favoriteUrl}/${trafficModelId}`);
    expect(req.request.method).toBe('POST');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should remove a favorite successfully', () => {
    // Arrange
    const trafficModelId = 1;

    // Act
    service.removeFavorite(trafficModelId).subscribe(response => {
      // Assert
      expect(response).toBeTruthy();
    });

    const req = httpController.expectOne(`${service.favoriteUrl}/${trafficModelId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle error when removing a favorite', () => {
    // Arrange
    const trafficModelId = 1;
    const errorMessage = 'Failed to remove favorite';

    // Act
    service.removeFavorite(trafficModelId).subscribe(
      () => fail('expected an error, not a success'),
      error => {
        // Assert
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      }
    );

    const req = httpController.expectOne(`${service.favoriteUrl}/${trafficModelId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });


  it('should add a rating successfully', () => {
    // Arrange
    const trafficModelId = 1;
    const rating = 4;

    // Act
    service.addRating(trafficModelId, rating).subscribe(response => {
      // Assert
      expect(response.trafficModelId).toBe(1);
      expect(response.averageRating).toBe(3.5);
    });

    const req = httpController.expectOne(`${service.ratingUrl}/${trafficModelId}/${rating}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyFavorites[0].rating);
  });

  it('should update a rating successfully', () => {
    // Arrange
    const trafficModelId = 1;
    const rating = 4;

    // Act
    service.updateRating(trafficModelId, rating).subscribe(response => {
      // Assert
      expect(response.trafficModelId).toBe(1);
      expect(response.averageRating).toBe(3.5);
    });

    const req = httpController.expectOne(`${service.ratingUrl}/${trafficModelId}/${rating}`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyFavorites[0].rating);
  });

  it('should delete a rating successfully', () => {
    // Arrange
    const trafficModelId = 1;
    const userId = 1;

    // Act
    service.deleteRating(trafficModelId, userId).subscribe(response => {
      // Assert
      expect(response).toBe(3.5);
    });

    const req = httpController.expectOne(`${service.ratingUrl}/${userId}/${trafficModelId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyFavorites[0].rating.averageRating);
  });

  it('should get favorites of user', () => {
    // Arrange
    const userId = 1;

    // Act
    service.getFavoritesOfUser().subscribe(response => {
      // Assert
      expect(response.length).toBe(dummyFavorites.length);
      expect(response[0].id).toBe(1);
      expect(response[0].name).toBe('Dummy Traffic Model');
    });

    const req = httpController.expectOne(service.favoriteUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyFavorites);
  });

  it('should add comment successfully', () => {
    // Arrange
    const comment = 'This is a test comment';
    const trafficModelId = 1;

    // Act
    service.addComment({ ...dummyComment, id: null }).subscribe(response => {
      // Assert
      expect(response).toBeTruthy();
      expect(response.id).toBe(trafficModelId);
      expect(response.trafficModelId).toBe(dummyComment.trafficModelId);
    });

    const req = httpController.expectOne(service.commentUrl);
    expect(req.request.method).toBe('POST');
    req.flush(dummyComment);
  });

  it('should update comment successfully', () => {
    // Arrange
    const comment = 'This is an updated test comment';

    // Act
    service.updateComment(dummyComment).subscribe(response => {
      // Assert
      expect(response).toBeTruthy();
      expect(response.id).toBe(dummyComment.id);
      expect(response.content).toBe(comment);
    });

    const req = httpController.expectOne(`${service.commentUrl}/${dummyComment.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ...dummyComment, content: comment });
  });

  it('should delete comment successfully', () => {
    // Arrange
    const commentId = 1;

    // Act
    service.deleteComment(commentId).subscribe(response => {
      // Assert
      expect(response).toBeTruthy();
    });

    const req = httpController.expectOne(`${service.commentUrl}/${commentId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
