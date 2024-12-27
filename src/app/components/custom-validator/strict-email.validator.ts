import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strictEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Regex pattern for strict email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if value matches the regex
    const isValidEmail = emailRegex.test(control.value);
     // Return an error object if invalid, otherwise return null
    return isValidEmail ? null : { email: true };
  };
}