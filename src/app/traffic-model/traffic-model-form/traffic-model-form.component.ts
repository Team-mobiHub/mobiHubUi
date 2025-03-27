import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeTrafficModelDTO } from '../../shared/dtos/ChangeTrafficModelDTO';
import { TrafficModelDto } from '../../shared/dtos/traffic-model-dto';
import { UserDto } from '../../shared/dtos/user-dto';
import { Framework, FRAMEWORK_PRETTY_STRINGS } from '../../shared/enums/framework';
import { ModelLevel, MODEL_LEVEL_DETAILS, MODEL_LEVEL_PRETTY_STRINGS } from '../../shared/enums/model-level';
import { MODEL_METHOD_PRETTY_STRINGS, ModelMethod } from '../../shared/enums/model-method';
import { CharacteristicDTO } from '../../shared/dtos/characteristic-dto';
import { FileStatusDTO } from '../../shared/dtos/file-status-dto';
import { FileChangeType } from '../../shared/enums/file-change-type';
import { AuthService } from '../../shared/services/auth.service';
import { noDuplicateCharacteristicsValidator } from '../../shared/validators/no-duplicate-characteristics.validator';
import { VALIDATOR_ERROR_KEYS } from '../../shared/validators/validator-error-keys';

const MAX_NUMBER_OF_IMAGES = 12;
const IMAGE_MIME_TYPES = [
  'image/gif',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp'
];

const ZIP_MIME_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'multipart/x-zip',
  'application/x-compressed'
];

const URL_REG_EX = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

const COORDINATES_REGEX = '^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?),\\s*[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$';

@Component({
  selector: 'mh-traffic-model-form',
  standalone: false,

  templateUrl: './traffic-model-form.component.html',
  styleUrl: './traffic-model-form.component.scss'
})
/**
 * TrafficModelFormComponent is responsible for handling the form related to traffic model creation and editing.
 * It includes form controls, validation, and event handling for submitting the traffic model data.
 */
export class TrafficModelFormComponent implements OnChanges {
  /**
   * Input property that receives a TrafficModelDto object.
   * This property is optional and can be undefined if you want to create a new traffic model or be set if you want to edit a traffic model.
   */
  @Input() trafficModel?: TrafficModelDto;

  /**
   * Event emitter that emits an object containing the traffic model data.
   * 
   * @event
   * @property {CreateTrafficModelDto} createTmDTO - The DTO for creating a traffic model.
   * @property {File} zipFile - The zip file associated with the traffic model.
   * @property {File[]} images - An array of image files related to the traffic model.
   */
  @Output() submitTrafficModel = new EventEmitter<{
    createTmDTO: ChangeTrafficModelDTO,
    zipFile: File,
    images: File[],
    formSubmissionCompleted: () => void
  }>();

  /**
   * The available frameworks.
   */
  frameworks = Object.values(Framework);
  /**
   * The pretty strings for the frameworks.
   */
  FRAMEWORK_PRETTY_STRINGS = FRAMEWORK_PRETTY_STRINGS;

  /**
   * The available model levels.
   */
  modelLevels = Object.values(ModelLevel);
  /**
   * The pretty strings for the model levels.
   */
  MODEL_LEVEL_PRETTY_STRINGS = MODEL_LEVEL_PRETTY_STRINGS;

  /**
   * Properties for configuring the image drop zone.
   */
  imageDropZoneProps = {
    maxAllowedFiles: MAX_NUMBER_OF_IMAGES,
    minRequiredFiles: 0,
    allowedFileTypes: IMAGE_MIME_TYPES,
    fileDesignation: 'images'
  };

  /**
   * Properties for configuring the ZIP file drop zone.
   */
  zipDropZoneProps = {
    maxAllowedFiles: 1,
    minRequiredFiles: 1,
    allowedFileTypes: ZIP_MIME_TYPES,
    fileDesignation: 'zip-File'
  };

  /**
   * The form group for the traffic model form.
   */
  form: FormGroup;

  /**
   * The currently logged-in user.
   */
  currentUser: UserDto | undefined;

  /**
   * Keys for the error messages of the form fields.
   */
  validatorErrorKeys = VALIDATOR_ERROR_KEYS;

  /**
   * Getter for the zip file token from the traffic model.
   */
  get zipFileToken(): string[] {
    return this.trafficModel?.zipFileToken ? [this.trafficModel.zipFileToken] : []
  }

  /**
   * Getter for the image tokens from the traffic model.
   */
  get imageTokens(): string[] {
    return this.trafficModel?.imageURLs
      ? this.trafficModel.imageURLs.map(url => url.substring(url.lastIndexOf('/') + 1))
      : []
  }


  /**
   * Constructs an instance of TrafficModelFormComponent.
   * 
   * @param fb - An instance of FormBuilder used to create the form.
   * @param authService - An instance of AuthService used to get the current user.
   * 
   * Initializes the form with various controls and validators:
   * - `owner`: A required field.
   * - `name`: A required field with a maximum length of 64 characters.
   * - `description`: A required field with a maximum length of 1024 characters.
   * - `region`: A required field with a maximum length of 128 characters.
   * - `coordinates`: An optional field with a pattern validator and a maximum length of 128 characters.
   * - `isVisibilityPublic`: A required boolean field.
   * - `framework`: A required field.
   * - `dataSourceUrl`: An optional field with a URL pattern validator and a maximum length of 2048 characters.
   * - `images`: An optional field.
   * - `characteristics`: A form group for characteristics, built using `buildCharacteristicsForm` method.
   * - `zipFile`: A required field.
   */
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = new FormGroup({
      owner: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      name: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(64)
        ]
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(1024)
        ]
      }),
      region: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(128)
        ]
      }),
      coordinates: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.pattern(COORDINATES_REGEX),
          Validators.maxLength(128)
        ]
      }),
      isVisibilityPublic: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      framework: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      dataSourceUrl: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.pattern(URL_REG_EX),
          Validators.maxLength(2048),
        ]
      }),
      images: new FormControl('', {
        nonNullable: true
      }),
      characteristics: this.buildCharacteristicsForm(null),
      zipFile: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      })
    })

    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.form.patchValue({ owner: this.currentUser });
      }
    });
  }

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * 
   * This method checks if the `trafficModel` property is defined. If it is, it sets the form values
   * using the `trafficModel` data. If `trafficModel` is not defined, it sets the form's `owner` field
   * to the current user's name.
   */
  ngOnChanges(): void {
    if (this.trafficModel) {
      this.setFormValues(this.trafficModel);
    }
  }

  /**
   * Sets the form values based on the provided TrafficModelDto.
   *
   * @param trafficModel - The TrafficModelDto object containing the values to set in the form.
   */
  private setFormValues(trafficModel: TrafficModelDto) {
    this.form.patchValue(trafficModel);

    const owner = trafficModel.userId && trafficModel.userId === this.currentUser?.id
      ? this.currentUser
      : trafficModel.teamId;
    this.form.patchValue({ owner: owner });

    this.form.setControl('characteristics', this.buildCharacteristicsForm(trafficModel.characteristics));
  }

  /**
   * Builds a FormGroup for traffic model characteristics.
   *
   * @returns {FormGroup} A FormGroup with controls for modelLevel and modelMethod,
   *                      both of which are required and non-nullable.
   */
  private buildCharacteristicsFormGroup(characteristic: CharacteristicDTO | null): FormGroup {
    return this.fb.group({
      modelLevel: new FormControl(characteristic?.modelLevel, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      modelMethod: new FormControl(characteristic?.modelMethod, {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }

  /**
   * Creates a FormArray containing a single FormGroup for characteristics.
   *
   * @returns {FormArray} A FormArray with one FormGroup initialized by buildCharacteristicsFormGroup().
   */
  buildCharacteristicsForm(characteristics: CharacteristicDTO[] | null): FormArray {
    const formArray = new FormArray(
      characteristics
        ? characteristics.map(c => this.buildCharacteristicsFormGroup(c))
        : [this.buildCharacteristicsFormGroup(null)]
    );
    formArray.setValidators(noDuplicateCharacteristicsValidator());
    return formArray;
  }

  /**
   * Adds a new characteristic to the characteristics array.
   * 
   * This method creates a new FormGroup for the characteristic
   * and pushes it to the characteristics FormArray.
   */
  addNewCharacteristic() {
    this.characteristics.push(this.buildCharacteristicsFormGroup(null));
  }

  /**
   * Getter for the 'characteristics' form array.
   * 
   * @returns {FormArray} The 'characteristics' form array from the form controls.
   * If the 'characteristics' control is not present, returns a new empty FormArray.
   */
  get characteristics(): FormArray {
    const characteristicsControl = this.form.controls['characteristics'];
    return characteristicsControl ? characteristicsControl as FormArray : new FormArray<any>([]);
  }

  /**
   * Retrieves the allowed model methods for the model level with the given index in the characteristics form array.
   * 
   * @param i - The index of the characteristic.
   * @returns An array of `ModelMethod` that are accepted for the specified characteristics model level.
   *          If the model level is not defined, an empty array is returned.
   */
  getallowedModelMethods(i: number): ModelMethod[] {
    const modelLevel = this.characteristics.at(i).get('modelLevel')?.value as ModelLevel;
    if (!modelLevel) {
      return [];
    }
    return MODEL_LEVEL_DETAILS[modelLevel].acceptedMethods;
  }

  /**
   * The pretty strings for the model methods.
   */
  MODEL_METHOD_PRETTY_STRINGS = MODEL_METHOD_PRETTY_STRINGS;

  /**
   * Deletes a characteristic from the characteristics array at the specified index.
   *
   * @param {number} id - The index of the characteristic to be removed.
   */
  deleteCharacteristic(id: number) {
    this.characteristics.removeAt(id);
  }

  /**
   * Handles the change event for image file inputs.
   * Updates the form with the selected image files.
   *
   * @param files - An array of selected image files.
   */
  onImageFilesChange(files: {
    file: File,
    status: FileChangeType
  }[]) {
    this.form.patchValue({ images: files });
  }

  /**
   * Handles the change event for the zip file input.
   * 
   * This method updates the form control for the zip file based on the selected files.
   * If a file is selected, it sets the value of the form control to the selected file
   * and clears any validators. If no file is selected, it sets the value of the form
   * control to an empty string and adds a required validator.
   * 
   * @param files - An array of selected files from the file input.
   */
  onZipFileChange(files: {
    file: File,
    status: FileChangeType
  }[]) {
    const zipFileControl = this.form.get('zipFile');
    if (files.filter(f => f.status !== FileChangeType.REMOVED).length > 0) {
      zipFileControl?.setValue(files.find(f => f.status === FileChangeType.ADDED));
      zipFileControl?.clearValidators();
    } else {
      zipFileControl?.setValue('');
      zipFileControl?.setValidators([Validators.required]);
    }
    zipFileControl?.markAsTouched();
    zipFileControl?.updateValueAndValidity();
  }

  /**
   * Asynchronously submits the form data by extracting values from the form,
   * transforming them into a `CreateTrafficModelDto` object, and emitting the
   * `submitTrafficModel` event with the created DTO and additional files.
   *
   * @returns {Promise<void>} A promise that resolves when the form submission is complete.
   */
  async submitForm() {
    this.form.disable();
    const formValue = this.form.getRawValue();

    const characteristics = formValue.characteristics.map((c: any) => {
      return {
        modelLevel: c.modelLevel,
        modelMethod: c.modelMethod
      } as CharacteristicDTO
    });

    const images: FileStatusDTO[] = formValue.images.map((image: {
      file: File,
      status: FileChangeType
    }) => {
      return { fileName: image.file.name, status: image.status } as FileStatusDTO;
    });

    const newTrafficModel: ChangeTrafficModelDTO = {
      id: this.trafficModel?.id || null,
      name: formValue.name,
      description: formValue.description,
      ownerUserId: formValue.owner.id,
      ownerTeamId: null, // TODO: Set when adding Teams
      isVisibilityPublic: formValue.isVisibilityPublic,
      dataSourceUrl: formValue.dataSourceUrl,
      characteristics: characteristics,
      framework: formValue.framework,
      region: formValue.region,
      coordinates: formValue.coordinates,
      hasZipFileChanged: formValue.zipFile ? formValue.zipFile.status === FileChangeType.ADDED : false,
      changedImages: images
    };

    this.submitTrafficModel.emit({
      createTmDTO: newTrafficModel,
      zipFile: formValue.zipFile ? formValue.zipFile.file : null,
      images: formValue.images.map((image: { file: File }) => image.file),
      formSubmissionCompleted: () => {
        this.form.enable();
      }
    });
  }
}
