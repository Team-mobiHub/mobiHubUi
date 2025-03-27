import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';
import { VALIDATOR_ERROR_KEYS } from './validator-error-keys';

describe('passwordMatchValidator', () => {
    let formGroup: FormGroup = new FormGroup({
        password: new FormControl('password'),
        confirmPassword: new FormControl('confirmPassword')
    }, {
        validators: passwordMatchValidator('password', 'confirmPassword')
    });

  it('should return error if passwords are not equal', () => {
    formGroup.controls['password'].setValue("password")
    formGroup.controls['confirmPassword'].setValue("newPassword")
    expect(formGroup.errors).toEqual({ [VALIDATOR_ERROR_KEYS.passwordMisMatch]: true });
  });

  it('should return error if emojis are not equal', () => {
    formGroup.controls['password'].setValue("💩")
    formGroup.controls['confirmPassword'].setValue("🙀")
    expect(formGroup.errors).toEqual({ [VALIDATOR_ERROR_KEYS.passwordMisMatch]: true });
  });

  it('should return null if passwords are null', () => {
    formGroup.controls['password'].setValue("")
    formGroup.controls['confirmPassword'].setValue("")
    expect(formGroup.errors).toEqual(null);
  });

  it('should return null if passwords are equal', () => {
    formGroup.controls['password'].setValue("password")
    formGroup.controls['confirmPassword'].setValue("password")
    expect(formGroup.errors).toEqual(null);
  });

});
