import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { passwordComplexityValidator } from './password-requirements.validator';

describe('passwordRequirementsValidator', () => {
    let formGroup: FormGroup = new FormGroup({
        password: new FormControl('password', passwordComplexityValidator()),
    });

    it('should return null if password is complex', () => {
        formGroup.controls['password'].setValue("Password?")
        expect(formGroup.controls["password"].errors).toEqual(null);
    });

    it('should return error if password is has no uppercase letter', () => {
        formGroup.controls['password'].setValue("pass?")
        expect(formGroup.controls["password"].errors).toEqual({ missingUpperCase: true});
    });

    it('should return error if password is has no special letter', () => {
        formGroup.controls['password'].setValue("Pass")
        expect(formGroup.controls["password"].errors).toEqual({ missingSpecialCharacter: true });
    });

    it('should return error if password is has no lowercase letter', () => {
        formGroup.controls['password'].setValue("PASS?")
        expect(formGroup.controls["password"].errors).toEqual({ missingLowerCase: true });
    });

    it('should return error if password has only emojis', () => {
        formGroup.controls['password'].setValue("💩💩💩")
        expect(formGroup.controls["password"].errors).toEqual({ missingLowerCase: true, missingUpperCase: true })
    });
});
