import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OverwriteFileDialogComponent } from '../overwrite-file-dialog/overwrite-file-dialog.component';
import { FileChangeType } from '../../shared/enums/file-change-type';

/**
 * DropZoneComponent is a component that allows users to drag and drop files or select files for upload.
 * It emits an event when the files change and validates the file types and number of files.
 */
@Component({
  selector: 'mh-drop-zone',
  standalone: false,

  templateUrl: './drop-zone.component.html',
  styleUrl: './drop-zone.component.scss'
})
export class DropZoneComponent implements OnChanges {

  /**
   * Event emitter that emits an array with the oploaded files when they change.
   */
  @Output() filesChanged = new EventEmitter<
    {
      file: File,
      status: FileChangeType
    }[]>();


  /**
   * Input properties for the DropZone component.
   * 
   * @property {number} maxAllowedFiles - The maximum number of files allowed to be uploaded.
   * @property {number} minRequiredFiles - The minimum number of files required to be uploaded.
   * @property {string[]} allowedFileTypes - The array of allowed file types for upload.
   * @property {string} fileDesignation - The designation or label for the file type. It is used in the UI.
   */
  @Input() props: {
    maxAllowedFiles: number;
    minRequiredFiles: number;
    allowedFileTypes: string[];
    fileDesignation: string;
  } = {
      maxAllowedFiles: 1,
      minRequiredFiles: 1,
      allowedFileTypes: [''],
      fileDesignation: 'file'
    };

  /**
   * An array of existing files that are already uploaded.
   */
  @Input() existingFiles?: string[];

  /**
   * A boolean flag indicating whether the drop zone is disabled.
   * When set to `true`, the drop zone is disabled and users cannot upload files.
   */
  @Input() disabled: boolean = false;

  /**
   * An array to hold the files dropped into the drop zone.
   * This array is initially empty and will be populated with File objects.
   */
  files: {
    file: File,
    status: FileChangeType
  }[] = [];

  /**
   * A dialog service used to open and manage the overwrite file dialog.
   * This service is injected using Angular's dependency injection.
   */
  overwriteFileDialog = inject(MatDialog);


  /**
   * A flag indicating whether the drop zone component has unsaved changes.
   * When set to `true`, it means there are changes that have not been saved.
   */
  isDirty = false;

  /**
   * A boolean flag indicating whether the component has been initialized.
   * Defaults to `false`.
   */
  isInitialized = false;

  /**
   * Initializes the component and sets the initial state of the component.
   */
  ngOnChanges(): void {
    if (!this.isInitialized && this.existingFiles) {
      this.files = this.existingFiles.map(f => ({ file: new File([], f), status: FileChangeType.NONE }));
      this.filesChanged.emit(this.files);
      this.isInitialized = true;
    }
  }

  /**
   * A getter that returns the list of files to be displayed in the UI.
   */
  get filesToDisplay(): File[] {
    return this.files.filter(f => f.status !== FileChangeType.REMOVED).map(f => f.file);
  }

  /**
   * Handles the dragover event for the drop zone.
   * 
   * @param event - The drag event triggered when an item is dragged over the drop zone.
   */
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone.classList.add('dragover');
  }

  /**
   * Handles the drag leave event for the drop zone.
   * 
   * @param event - The drag leave event.
   */
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone.classList.remove('dragover');
  }

  /**
   * Handles the drop event when files are dropped into the drop zone.
   * 
   * @param event - The drag event containing the dropped files.
   */
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = event.currentTarget as HTMLElement;
    dropZone.classList.remove('dragover');

    const newFiles = event.dataTransfer?.files;
    if (newFiles && newFiles.length > 0) {
      this.processNewFiles(newFiles);
    }
  }

  /**
   * Handles the file selection event from an input element.
   * 
   * @param event - The event triggered by the file input element.
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      this.processNewFiles(input.files);
    }
  }


  /**
   * Processes the newly added files.
   * 
   * This method checks if the file types are valid and if the number of files
   * does not exceed the allowed limit. If the file types are invalid, an alert
   * is shown to the user. If the number of files exceeds the allowed limit, 
   * an alert is shown to the user. Depending on the maximum allowed files, 
   * it processes either a single file or multiple files.
   * 
   * @param newFiles - The list of new files to be processed.
   */
  private processNewFiles(newFiles: FileList) {
    if (!this.areFileTypesValide(newFiles)) {
      alert('Only files of type ' + this.props.allowedFileTypes.join(', ') + ' are allowed.');
      return;
    }

    if (this.props.maxAllowedFiles === 1) {
      if (newFiles.length > 1) {
        alert('Only 1 file is allowed.');
        return;
      }
      this.processSingleFile(newFiles[0]);
    } else {
      this.processMultipleFiles(newFiles);
    }
  }

  /**
   * Processes a single file by either adding it to the list of files if the list is empty,
   * or opening a dialog to confirm overwriting the existing file.
   * 
   * @param newFile - The new file to be processed.
   */
  private processSingleFile(newFile: File) {
    if (this.files.filter(f => f.status !== FileChangeType.REMOVED).length === 0) {
      this.addNewFiles([newFile]);
      return;
    } else {
      const dialogRef = this.overwriteFileDialog.open(OverwriteFileDialogComponent, {
        data: { fileName: this.files[0].file.name },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.files = [];
          this.addNewFiles([newFile]);
        }
        return;
      });
    }
  }

  /**
   * Processes multiple files by checking if adding new files is allowed and if the files are not already added.
   * If the number of new files exceeds the allowed limit, an alert is shown.
   * If a file is already added, an alert is shown.
   * Otherwise, the new files are added.
   *
   * @param newFiles - The list of new files to be processed.
   */
  private processMultipleFiles(newFiles: FileList) {
    if (!this.isAddingNewFilesAllowed(newFiles.length)) {
      alert('Only ' + this.props.maxAllowedFiles + ' files are allowed.');
      return;
    }

    for (const file of newFiles) {
      if (this.files.find(f => f.file.name === file.name)) {
        alert('File ' + file.name + ' already added.');
        return;
      }
    }
    this.addNewFiles(Array.from(newFiles));
  }


  /**
   * Adds new files to the existing list of files and emits the updated list.
   * Also marks the component as dirty.
   *
   * @param {File[]} files - An array of File objects to be added.
   */
  private addNewFiles(files: File[]) {
    this.files.push(...Array.from(files.map(f => ({ file: f, status: FileChangeType.ADDED }))));
    this.filesChanged.emit(this.files);
    this.isDirty = true;
  }

  /**
   * Checks if all files in the provided FileList have valid types.
   *
   * @param filesToTest - The list of files to be tested.
   * @returns `true` if all files have valid types, otherwise `false`.
   */
  private areFileTypesValide(filesToTest: FileList): boolean {
    for (const file of filesToTest) {
      if (!this.props.allowedFileTypes.includes(file.type)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determines if adding new files is allowed based on the current number of files and the maximum allowed files.
   *
   * @param numberOfNewFiles - The number of new files to be added. Defaults to 1.
   * @returns A boolean indicating whether adding the new files is allowed.
   */
  isAddingNewFilesAllowed(numberOfNewFiles: number = 1) {
    return (numberOfNewFiles + this.files.filter(f => f.status !== FileChangeType.REMOVED).length) <= this.props.maxAllowedFiles;
  }

  /**
   * Determines if adding new files is required based on the current number of files
   * and the minimum required files specified in the component's properties.
   *
   * @returns {boolean} - Returns `true` if the number of files is less than the minimum required files, otherwise `false`.
   */
  isAddingNewFilesRequired() {
    return this.files.filter(f => f.status !== FileChangeType.REMOVED).length < this.props.minRequiredFiles;
  }

  /**
   * Removes a specified file from the list of files and emits the updated list.
   * 
   * @param file - The file to be removed from the list.
   */
  removeFile(file: File) {
    const fileToRemove = this.files.find(f => f.file === file);
    if (fileToRemove) {
      if (fileToRemove.status === FileChangeType.ADDED) {
        this.files = this.files.filter(f => f.file !== file);
      } else {
        fileToRemove.status = FileChangeType.REMOVED;
      }
    }
    this.filesChanged.emit(this.files);
  }
}
