const accountValidations = {
  validateEmail: email => {
    email = email.trim();
    if (email.length < 3) {
      return false;
    }
    let emailValidator = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return emailValidator.test(String(email).toLowerCase());
  },
  validatePassword: password => {
    password = password.trim();
    if (password.length < 1) {
      return false;
    }
    let passwordValidator = new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.{6,})');
    return passwordValidator.test(password);
  },
  validatePhoneNumber: phone => {
    let phoneValidator = new RegExp(
      /^(\+\d{1,3}[-]?)?(\d{3}[-]?)(\d{3}[-]?)(\d{4})$/
    );
    return phoneValidator.test(phone);
  },
  validateUrl: (url, httpRequired = false) => {
    url = url.trim();
    if (url.length < 1) {
      return false;
    }
    let withHttp = new RegExp(
      'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)'
    );
    let withoutHttp = new RegExp(
      '[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)'
    );
    if (httpRequired) {
      return withHttp.test(url);
    } else {
      return withoutHttp.test(url);
    }
  },
  validateDate: date => {
    let dateValidator = new RegExp(
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    );
    return dateValidator.test(date);
  }
};

export default accountValidations;
