import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CharacteristicDTO } from '../../shared/dtos/characteristic-dto';
import { VALIDATOR_ERROR_KEYS } from './validator-error-keys';

/**
 * Validator to check for duplicate characteristics in a FormArray.
 * 
 * This validator ensures that no two characteristics in the FormArray have the same
 * combination of modelLevel and modelMethod.
 * 
 * @returns A ValidatorFn that checks for duplicate characteristics.
 */
export function noDuplicateCharacteristicsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!(control instanceof FormArray)) {
            return null;
        }

        const characteristics = control.value as CharacteristicDTO[];
        const seenCharacteristics = new Set<string>();

        for (const characteristic of characteristics) {
            const key = `${characteristic.modelLevel}-${characteristic.modelMethod}`;
            if (seenCharacteristics.has(key)) {
                return { [ VALIDATOR_ERROR_KEYS.duplicateCharacteristics ]: true };
            }
            seenCharacteristics.add(key);
        }

        return null;
    };
}