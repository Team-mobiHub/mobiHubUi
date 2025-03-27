import { FormArray, FormControl } from '@angular/forms';
import { noDuplicateCharacteristicsValidator } from './no-duplicate-characteristics.validator';
import { VALIDATOR_ERROR_KEYS } from './validator-error-keys';
import { CharacteristicDTO } from '../../shared/dtos/characteristic-dto';

/**
 * Tests the `noDuplicateCharacteristicsValidator` function.
 */
describe('noDuplicateCharacteristicsValidator', () => {
    it('should return null if control is not a FormArray', () => {
        const control = new FormControl();
        const validator = noDuplicateCharacteristicsValidator();
        expect(validator(control)).toBeNull();
    });

    it('should return null if there are no duplicate characteristics', () => {
        const control = new FormArray([
            new FormControl({ modelLevel: 'level1', modelMethod: 'method1' }),
            new FormControl({ modelLevel: 'level2', modelMethod: 'method2' })
        ]);
        const validator = noDuplicateCharacteristicsValidator();
        expect(validator(control)).toBeNull();
    });

    it('should return an error if there are duplicate characteristics', () => {
        const control = new FormArray([
            new FormControl({ modelLevel: 'level1', modelMethod: 'method1' }),
            new FormControl({ modelLevel: 'level1', modelMethod: 'method1' })
        ]);
        const validator = noDuplicateCharacteristicsValidator();
        expect(validator(control)).toEqual({ [VALIDATOR_ERROR_KEYS.duplicateCharacteristics]: true });
    });

    it('should return null if FormArray is empty', () => {
        const control = new FormArray([]);
        const validator = noDuplicateCharacteristicsValidator();
        expect(validator(control)).toBeNull();
    });

    it('should return null if characteristics have different modelLevel but same modelMethod', () => {
        const control = new FormArray([
            new FormControl({ modelLevel: 'level1', modelMethod: 'method1' }),
            new FormControl({ modelLevel: 'level2', modelMethod: 'method1' })
        ]);
        const validator = noDuplicateCharacteristicsValidator();
        expect(validator(control)).toBeNull();
    });

    it('should return null if characteristics have same modelLevel but different modelMethod', () => {
        const control = new FormArray([
            new FormControl({ modelLevel: 'level1', modelMethod: 'method1' }),
            new FormControl({ modelLevel: 'level1', modelMethod: 'method2' })
        ]);
        const validator = noDuplicateCharacteristicsValidator();
        expect(validator(control)).toBeNull();
    });
});