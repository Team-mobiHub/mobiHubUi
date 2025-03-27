import { TestBed } from '@angular/core/testing';

import { TrafficModelService } from './traffic-model.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchRequestDto } from '../dtos/search-request-dto';
import { SearchResultDto } from '../dtos/search-result-dto';
import { OwnerType } from '../enums/owner-type';
import { TrafficModelDto } from '../dtos/traffic-model-dto';
import { Framework } from '../enums/framework';
import { ChangeTrafficModelDTO } from '../dtos/ChangeTrafficModelDTO';
import { FileChangeType } from '../enums/file-change-type';
import { CreateTrafficModelResponseDTO } from '../dtos/create-traffic-model-response-dto';


const searchRequest: SearchRequestDto = {
  page: 1,
  pageSize: 10,
  name: 'Test Traffic Model',
  authorName: 'Test Author',
  region: 'Test Region',
  modelLevels: [],
  modelMethods: [],
  frameworks: []
};
const mockSearchResult: SearchResultDto = {
  totalCount: 1,
  searchResult: [
    {
      trafficModelId: 1,
      name: 'Test Traffic Model',
      description: 'Test Description',
      averageRating: 5,
      imageURL: 'test-image.jpg'
    }
  ]
};

const dummyTrafficModelRequest: ChangeTrafficModelDTO = {
  id: 1,
  name: 'Test TM',
  description: 'Test desc',
  ownerUserId: 1,
  ownerTeamId: null,
  isVisibilityPublic: true,
  dataSourceUrl: '',
  characteristics: [],
  framework: Framework.PTV_VISSIM,
  region: '',
  coordinates: null,
  hasZipFileChanged: true,
  changedImages: [
    {
      fileName: 'test.jpg',
      status: FileChangeType.ADDED
    }
  ]
}

const dummyCreateTrafficModelResponse: CreateTrafficModelResponseDTO = {
  id: 1,
  name: 'Test TM',
  description: 'Test desc',
  ownerUserId: 1,
  ownerTeamId: null,
  isVisibilityPublic: true,
  dataSourceUrl: '',
  characteristics: [],
  framework: Framework.PTV_VISSIM,
  region: '',
  coordinates: null,
  zipFileToken: 'f79559dc-b12d-46af-b9b5-19e20101f757',
  imageTokens: [
    'be98749e-7dab-4f5c-9b37-a10ec7f55cc5'
  ]
}

const dummyZipFile: File = new File([''], 'test.zip', { type: 'application/zip' });
const dummyImageFiles: File[] = [new File([''], 'test.jpg', { type: 'image/jpeg' })];


/**
 * Tests the TrafficModelService.
 */
describe('TrafficModelService', () => {
  let httpController: HttpTestingController;
  let service: TrafficModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(TrafficModelService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search traffic models', () => {
    service.search(searchRequest).subscribe(result => {
      expect(result).toEqual(mockSearchResult);
    });

    const req = httpController.expectOne(`${service.trafficModelUrl}/search`);
    expect(req.request.method).toBe('POST');
    req.flush(mockSearchResult);
  });

  it('should handle search errors', () => {
    service.search(searchRequest).subscribe(
      () => fail('expected an error'),
      error => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpController.expectOne(`${service.trafficModelUrl}/search`);
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('An error occurred'));
  });

  it('should get download URL for traffic model data', () => {
    const trafficModelId = 1;
    const downloadUrl = 'http://test.com/test.zip';

    service.downloadTrafficModelData(trafficModelId).subscribe(result => {
      expect(result).toEqual(downloadUrl);
    });

    const req = httpController.expectOne(`${service.trafficModelUrl}/${trafficModelId}/download`);
    expect(req.request.method).toBe('GET');
    req.flush(downloadUrl);
  });

  it('should delete a traffic model', () => {
    const trafficModelId = 1;

    service.delete(trafficModelId).subscribe(result => {
      expect(result).toBeNull();
    });

    const req = httpController.expectOne(`${service.trafficModelUrl}/${trafficModelId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('getByOwner sould return traffic models owned by the specified owner', () => {
    const ownerId = 1;
    const ownerType: OwnerType = OwnerType.USER;

    service.getByOwner(ownerId, ownerType).subscribe(result => {
      expect(result[0].name).toEqual(mockSearchResult.searchResult[0].name);
    });

    const req = httpController.expectOne(`${service.trafficModelUrl}/${ownerType}/${ownerId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSearchResult.searchResult);
  });

  it('Create should create the traffic model data correctly', () => {
    const trafficModelId = 1;

    service.create({ ...dummyTrafficModelRequest, id: null }, dummyZipFile, dummyImageFiles).subscribe(result => {
      expect(result.id).toEqual(trafficModelId);
      expect(result.name).toEqual(dummyTrafficModelRequest.name);
    });

    const req = httpController.expectOne(service.trafficModelUrl);
    expect(req.request.method).toBe('POST');
    req.flush(dummyCreateTrafficModelResponse);

    const zipFileReq = httpController.expectOne(`${service.trafficModelUrl}/${trafficModelId}/uploadZip/${dummyCreateTrafficModelResponse.zipFileToken}`);
    expect(zipFileReq.request.method).toBe('POST');
    zipFileReq.flush(null);
  });

  it('Create should handle errors', () => {
    service.create({ ...dummyTrafficModelRequest, id: null }, dummyZipFile, dummyImageFiles).subscribe(
      () => fail('expected an error'),
      error => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpController.expectOne(service.trafficModelUrl);
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('An error occurred'));
  });

  it('Create should handle traffic model id is null', () => {
    service.create({ ...dummyTrafficModelRequest, id: 0 }, dummyZipFile, dummyImageFiles).subscribe(
      () => fail('expected an error'),
      error => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpController.expectOne(service.trafficModelUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ ...dummyCreateTrafficModelResponse, id: null });
  });

  it('Create should handle zip file upload errors', () => {
    service.create({ ...dummyTrafficModelRequest, id: null }, dummyZipFile, dummyImageFiles).subscribe(
      () => fail('expected an error'),
      error => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpController.expectOne(service.trafficModelUrl);
    expect(req.request.method).toBe('POST');
    req.flush(dummyCreateTrafficModelResponse);

    const zipFileReq = httpController.expectOne(`${service.trafficModelUrl}/${dummyCreateTrafficModelResponse.id}/uploadZip/${dummyCreateTrafficModelResponse.zipFileToken}`);
    expect(zipFileReq.request.method).toBe('POST');
    zipFileReq.error(new ErrorEvent('An error occurred'));
  });

  it('Update should update the traffic model data correctly', () => {
    const trafficModelId = 1;

    service.update(dummyTrafficModelRequest, dummyZipFile, dummyImageFiles).subscribe(result => {
      expect(result.id).toEqual(trafficModelId);
      expect(result.name).toEqual(dummyTrafficModelRequest.name);
    });

    const req = httpController.expectOne(`${service.trafficModelUrl}/${trafficModelId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyCreateTrafficModelResponse);

    const zipFileReq = httpController.expectOne(`${service.trafficModelUrl}/${trafficModelId}/uploadZip/${dummyCreateTrafficModelResponse.zipFileToken}`);
    expect(zipFileReq.request.method).toBe('POST');
    zipFileReq.flush(null);
  });

  it('Update should handle errors', () => {
    service.update(dummyTrafficModelRequest, dummyZipFile, dummyImageFiles).subscribe(
      () => fail('expected an error'),
      error => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpController.expectOne(`${service.trafficModelUrl}/${dummyTrafficModelRequest.id}`);
    expect(req.request.method).toBe('PUT');
    req.error(new ErrorEvent('An error occurred'));
  });

});
