import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { emailPatternValidator } from './email-pattern.validator';

describe('emailPatternValidator', () => {
    let formGroup: FormGroup = new FormGroup({
        email: new FormControl('email', emailPatternValidator()),
    });

    it('should return null if email conforms to regex', () => {
        formGroup.controls['email'].setValue("test@gmail.com")
        expect(formGroup.controls["email"].errors).toEqual(null);
    });

    it('should return error if email is not valid', () => {
        formGroup.controls['email'].setValue("test@.com")
        expect(formGroup.controls["email"].errors).toEqual({ emailPattern: true});
    });
});