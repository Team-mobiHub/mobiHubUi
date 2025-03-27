import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ChangeTrafficModelDTO } from '../dtos/ChangeTrafficModelDTO';
import { SearchRequestDto } from '../dtos/search-request-dto';
import { TrafficModelDto } from '../dtos/traffic-model-dto';
import { OwnerType } from '../enums/owner-type';
import { ApiService } from './api.service';
import { CreateTrafficModelResponseDTO } from '../dtos/create-traffic-model-response-dto';
import { FileChangeType } from '../enums/file-change-type';
import { SearchResultDto } from '../dtos/search-result-dto';


/**
 * The `TrafficModelService` class provides methods for traffic model management.
 */
@Injectable({
  providedIn: 'root'
})
export class TrafficModelService extends ApiService {

  /**
   * The URL for the traffic model endpoint.
   */
  trafficModelUrl: string = this.backendBaseUrl + '/trafficModel';

  /**
   * Creates an instance of TrafficModelService.
   *
   * @param http - An instance of HttpClient used to make HTTP requests.
   */
  constructor(private readonly http: HttpClient) {
    super();
  }

  /**
   * Creates a new traffic model.
   *
   * @param {ChangeTrafficModelDTO} request - The request object containing the traffic model data.
   * @param {File} zipFile - The zip file to be uploaded.
   * @param {File[]} images - The array of image files to be uploaded.
   * @returns {Observable<TrafficModelDto>} An observable containing the created traffic model.
   */
  create(request: ChangeTrafficModelDTO, zipFile: File, images: File[]): Observable<CreateTrafficModelResponseDTO> {
    return this.http.post<CreateTrafficModelResponseDTO>(this.trafficModelUrl, request)
      .pipe(
        catchError(error => {
          console.error('Error creating the traffic model:', error);
          throw error;
        }),

        switchMap((createdTrafficModel: CreateTrafficModelResponseDTO) => {
          if (createdTrafficModel.id === null) {
            throw new Error('Traffic model ID is null.');
          }

          return this.handleFileUploads(createdTrafficModel, zipFile, images);
        })
      );
  }


  /**
   * Updates the traffic model with the provided request data, zip file, and images.
   *
   * @param {ChangeTrafficModelDTO} request - The request data for updating the traffic model.
   * @param {File} zipFile - The zip file containing the traffic model data.
   * @param {File[]} images - An array of image files to be uploaded.
   * @returns {Observable<CreateTrafficModelResponseDTO>} An observable that emits the response of the traffic model creation.
   *
   * @throws Will throw an error if the HTTP request fails.
   */
  update(request: ChangeTrafficModelDTO, zipFile: File, images: File[]): Observable<CreateTrafficModelResponseDTO> {
    return this.http.put<CreateTrafficModelResponseDTO>(`${this.trafficModelUrl}/${request.id}`, request)
      .pipe(
        catchError(error => {
          console.error('Error updating the traffic model:', error);
          throw error;
        }),

        switchMap((updatedTrafficModel: CreateTrafficModelResponseDTO) => {
          const newImages = request.changedImages
            .filter(image => image.status === FileChangeType.ADDED)
            .map(image => images.find(i => i.name === image.fileName))
            .filter((image): image is File => image !== undefined);

          return this.handleFileUploads(updatedTrafficModel, request.hasZipFileChanged ? zipFile : null, newImages);
        })
      )
  }

  /**
   * Handles the file uploads for a traffic model.
   *
   * @param trafficModel - The traffic model for which the files are being uploaded.
   * @param zipFile - The zip file to be uploaded. If null, no zip file will be uploaded.
   * @param images - The array of image files to be uploaded.
   * @returns An observable that emits the traffic model DTO.
   *
   * @throws Will throw an error if the upload fails.
   */
  private handleFileUploads(trafficModel: CreateTrafficModelResponseDTO, zipFile: File | null, images: File[]): Observable<CreateTrafficModelResponseDTO> {
    let zipFileUpload$: Observable<HttpResponse<any>>;
    if (zipFile !== null) {
      zipFileUpload$ = this.uploadZipFile(trafficModel.id!!, trafficModel.zipFileToken, zipFile);
    }
    else {
      zipFileUpload$ = of(new HttpResponse({ status: HttpStatusCode.Created }));
    }

    if (trafficModel.imageTokens.length !== images.length) {
      throw new Error('Number of image tokens does not match the number of images.');
    }

    const imageUploads$ = images.map((image, index) =>
      this.uploadImage(trafficModel.id!, trafficModel.imageTokens[index], image)
    );

    return forkJoin([zipFileUpload$, ...imageUploads$]).pipe(
      switchMap(([zipResponse, ...imagesResponses]) => {

        if (zipResponse.status !== HttpStatusCode.Created) {
          throw new Error('Error uploading the zip file.');
        }

        if (imagesResponses.some((response: HttpResponse<any>) => response.status !== HttpStatusCode.Created)) {
          throw new Error('Error uploading an image file.');
        }

        return of(trafficModel);
      }),
      catchError(error => {
        console.error('Error during file uploads:', error);
        throw error;
      })
    );
  }

  /**
   * Uploads a zip file to the server for a specific traffic model.
   *
   * @param trafficModelId - The ID of the traffic model to which the zip file will be uploaded.
   * @param token - The file token for the zip file.
   * @param zipFile - The zip file to be uploaded.
   * @returns An Observable that emits the HTTP response from the server.
   *
   * @throws Will throw an error if the upload fails.
   */
  private uploadZipFile(trafficModelId: number, token: string, zipFile: File): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('file', zipFile);

    return this.http.post<HttpResponse<any>>(
      `${this.trafficModelUrl}/${trafficModelId}/uploadZip/${token}`,
      formData,
      { observe: 'response' }
    )
      .pipe(
        catchError((error: any) => {
          console.error('Error uploading the zip file:', error);
          throw error;
        })
      );
  }


  /**
   * Uploads an image file to the server for a specific traffic model.
   *
   * @param trafficModelId - The ID of the traffic model to which the image file will be uploaded.
   * @param token - The file token for the image file.
   * @param image - The image file to be uploaded.
   * @returns An Observable that emits the HTTP response from the server.
   */
  private uploadImage(trafficModelId: number, token: string, image: File): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('file', image);

    return this.http.post<HttpResponse<any>>(
      `${this.trafficModelUrl}/${trafficModelId}/uploadImage/${token}`,
      formData,
      { observe: 'response' }
    ).pipe(
      catchError((error: any) => {
        console.error('Error uploading the image file:', error);
        throw error;
      })
    );
  }

  /**
   * Retrieve a TrafficModel DTO by its ID.
   *
   * @param id the id of the traffic model to be retrieved.
   * @returns An observable of the TrafficModel DTO.
   */
  getById(id: number): Observable<TrafficModelDto> {
    return this.http.get<TrafficModelDto>(this.trafficModelUrl + '/' + id);
  }

  /**
   * Returns the traffic models owned by the specified owner (User or Team).
   * @param ownerId
   * @param ownerType
   */
  getByOwner(ownerId: number, ownerType: OwnerType): Observable<TrafficModelDto[]> {
    return this.http.get<TrafficModelDto[]>(this.trafficModelUrl + '/' + ownerType + '/' + ownerId);
  }

  /**
   * Deletes a traffic model by its ID.
   *
   * @param trafficModelId The id of the traffic model to be deleted.
   * @returns An observable of the HTTP response.
   */
  delete(trafficModelId: number): Observable<any> {
    return this.http.delete(`${this.trafficModelUrl}/${trafficModelId}`);
  }

  /**
   * Retrieves the download URL for the traffic model data as an Observable String.
   *
   * @param trafficModelId The id of the model to be downloaded.
   * @returns An observable of the String that contains the download URL.
   */
  downloadTrafficModelData(trafficModelId: number): Observable<any> {
    return this.http.get(this.trafficModelUrl + '/' + trafficModelId + '/download', { responseType: 'text' });
  }

  getTransferOwnershipLink(trafficModelId: number): Observable<string> {
    throw new Error('Method not implemented.');
  }

  sendTransferOwnershipLinkByEmail(trafficModelId: number, emailAddress: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  useTransferOwnershipLink(token: string, ownerType: OwnerType, newOwnerId: number): Observable<any> {
    throw new Error('Method not implemented.');
  }

  /**
   * Searches for traffic models based on the specified search request.
   *
   * @param searchRequest - The search request, represented as a `SearchRequestDto` object.
   * @returns An observable of the search result, represented as a `SearchResultDto` object.
   */
  search(searchRequest: SearchRequestDto): Observable<SearchResultDto> {
    return this.http.post<SearchResultDto>(`${this.trafficModelUrl}/search`, searchRequest)
      .pipe(
        map(response => response),
        catchError(error => {
          throw error;
        })
      );
  }
}
