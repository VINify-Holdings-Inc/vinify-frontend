import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom Password Validator
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // If no value, validation passes for required validator
    }

    const errors: any = {};
    if (!/[A-Z]/.test(value)) {
      errors.missingUppercase = true;
    }
    if (!/[0-9]/.test(value)) {
      errors.missingNumber = true;
    }
    if (!/[!@#$%^&*]/.test(value)) {
      errors.missingSpecial = true;
    }
    if (value.length < 6) {
      errors.tooShort = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}
