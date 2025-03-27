import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that transforms a file size in bytes into a human-readable string with appropriate units.
 * 
 * @param value - The file size in bytes to be transformed.
 * @returns A string representing the file size in a human-readable format with appropriate units.
 */
@Pipe({
  name: 'fileSize',
  standalone: false
})
export class FileSizePipe implements PipeTransform {

  transform(value: number): string {
    const thresh = 1000;

    if (Math.abs(value as number) < thresh) {
      return value + ' B';
    }

    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    let u = -1;
    const r = 10;

    do {
      value = (value as number) / thresh;
      ++u;
    } while (Math.round(Math.abs(value as number) * r) / r >= thresh && u < units.length - 1);

    return (value as number).toFixed(1) + ' ' + units[u];
  }

}
