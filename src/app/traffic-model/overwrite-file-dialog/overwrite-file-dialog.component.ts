import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'mh-overwrite-file-dialog',
  standalone: false,

  templateUrl: './overwrite-file-dialog.component.html',
  styleUrl: './overwrite-file-dialog.component.scss'
})
/**
 * Component for handling the overwrite file dialog.
 * 
 * This component is used to display a dialog that prompts the user
 * to confirm if they want to overwrite an existing file.
 * 
 * @class
 */
export class OverwriteFileDialogComponent {
  /**
   * The name of the file to be overwritten, injected from MAT_DIALOG_DATA.
   */
  fileName = inject(MAT_DIALOG_DATA).fileName;
}
