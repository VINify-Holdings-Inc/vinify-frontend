const formValidator = (form, stopOnInvalid = false) => {
  let isValid = true;

  let keys = Object.keys(form);

  for (let i = 0; i < keys.length; i++) {
    //console.log("formValidator",form[keys[i]]);
    if (form[keys[i]].validate === false)
      continue;
    //console.log("formValidator1",form[keys[i]]);
    form[keys[i]].error = false;
    form[keys[i]] = required(form[keys[i]]);
    if (form[keys[i]].error && isValid) isValid = false;
    if (stopOnInvalid && !isValid) {
      return { isValid, form };
    }
  }
  return { isValid, form };
};

const required = form => {
  if (form.required) {
    if (form.value == '' || form.value == null) {
      form.error = true;
      form.errorComputedMessage = `${form.label} is required`;
    } else {
      form = regex(form);
    }
  } else {
    if (form.value != '' && form.value != null) form = regex(form);
  }
  return form;
};

const regex = form => {
  let result;
  if (form.regex) {
    result = checkRegex(form.value, form.regex);
    if (!result) {
      form.error = true;
      form.errorComputedMessage = form.errorMessage;
    } else {
      form = min(form);
    }
  } else {
    form = min(form);
  }
  return form;
};

const checkRegex = (value, regex) => {
  var validator = new RegExp(regex);
  return validator.test(value);
};

const min = form => {
  let result;
  if (form.min) {
    result = form.value > form.min;
    if (!result) {
      form.error = true;
      form.errorComputedMessage = `${form.label} must be  greater than ${form.min}`;
    } else {
      minEqual(form);
    }
  } else {
    form = minEqual(form);
  }
  return form;
};

const minEqual = form => {
  let result;
  if (form.minEqual) {
    result = form.value >= form.minEqual;
    if (!result) {
      form.error = true;
      form.errorComputedMessage = `${form.label} must be equal to or greater than ${form.minEqual}`;
    } else {
      form = max(form);
    }
  } else {
    form = max(form);
  }
  return form;
};

const max = form => {
  let result;
  if (form.max) {
    result = form.value < form.max;
    if (!result) {
      form.error = true;
      form.errorComputedMessage = `${form.label} must be less than ${form.max}`;
    } else {
      form = maxEqual(form);
    }
  } else {
    form = maxEqual(form);
  }
  return form;
};

const maxEqual = form => {
  let result;
  if (form.maxEqual) {
    result = form.value <= form.maxEqual;
    if (!result) {
      form.error = true;
      form.errorComputedMessage = `${form.label} must be equal to or less than ${form.maxEqual}`;
    } else {
      form = minLength(form);
    }
  } else {
    form = minLength(form);
  }
  return form;
};

const minLength = form => {
  let result;
  if (form.minLength) {
    result = form.value.length >= form.minLength;
    if (!result) {
      form.error = true;
      form.errorComputedMessage = `${form.label} must be at least ${form.minLength} characters in length`;
    } else {
      form = maxLength(form);
    }
  } else {
    form = maxLength(form);
  }
  return form;
};

const maxLength = form => {
  let result;
  if (form.maxLength) {
    result = form.value.length <= form.maxLength;
    if (!result) {
      form.error = true;
      form.errorComputedMessage = `${form.label} must not exceed ${form.maxLength} characters in length`;
    }
  } else {
    form = alphaNumeric(form);
  }
  return form;
};

const alphaNumeric = form => {
  if (form.alphaNumeric) {
    if (!checkRegex(form.value, '[^A-Za-z0-9 ]')) {
      form.error = true;
      form.errorComputedMessage = `${form.label} must contain only alphabets or numbers, and no special characters`;
    } else {
      form = invalidChars(form);
    }
  } else {
    form = invalidChars(form);
  }
  return form;
};

const invalidChars = form => {
  if (form.invalidChars) {
    if (checkInvalidChars(form.value, form.invalidChars)) {
      form.error = true;
      form.errorComputedMessage = `${form.label
        } must not contain following characters: ${form.invalidChars.toString()}`;
    } else {
      form = inValidValues(form);
    }
  } else {
    form = inValidValues(form);
  }
  return form;
};

const checkInvalidChars = (value, invalidChars) => {
  let result = false;
  for (let i = 0; i < invalidChars.length; i++) {
    result = value.includes(invalidChars[i]);
    if (result) {
      break;
    }
  }
  return result;
};

const inValidValues = form => {
  if (form.inValidValues) {
    if (form.values.includes(form.value)) {
      form.error = true;
      form.errorComputedMessage = `${form.label
        } must not be one of these: ${form.inValidValues.toString()}`;
    } else {
      form = values(form);
    }
  } else {
    form = values(form);
  }
  return form;
};

const values = form => {
  if (form.values) {
    form.values.includes(form.value);
    if (!form.values.includes(form.value)) {
      form.error = true;
      form.errorComputedMessage = `${form.label
        } must be one of these: ${form.values.toString()}`;
    } else {
      form = validator(form);
    }
  } else {
    form = validator(form);
  }
  return form;
};

const validator = form => {
  //console.log("vaid",form);
  if (form.validator) {
    const result = form.validator(form.value);
    if (typeof result === 'object') {
      if (!result.result) {
        form.error = true;
        form.errorComputedMessage = result.errorMessage;
      }
    } else if (!result) {
      form.error = true;
      form.errorComputedMessage = form.errorMessage;
    }
  }
  return form;
};

export default formValidator;
