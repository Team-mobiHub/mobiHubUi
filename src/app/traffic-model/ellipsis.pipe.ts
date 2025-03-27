import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
  standalone: false
})
export class EllipsisPipe implements PipeTransform {

  /**
   * Transforms a given string by truncating it to a specified limit and appending an ellipsis if necessary.
   *
   * @param value - The string to be transformed.
   * @param limit - The maximum length of the string before truncation. Defaults to 100.
   * @param ellipsis - The string to append to the truncated string. Defaults to '...'.
   * @returns The transformed string, truncated and appended with an ellipsis if it exceeds the limit.
   */
  transform(value: string, limit: number = 100, ellipsis: string = '...'): string {
    if (value.length <= limit) {
      return value;
    }
    return value.substring(0, limit) + ellipsis;
  }

}
