const snippetValidations = {
    validateUrl: (url, httpRequired = false) => {
        url = url.trim();
        if (url.length < 1) {
            return false;
        }
        var withHttp = new RegExp("https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)");
        var withoutHttp = new RegExp("[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)");
        if (httpRequired) {
            return withHttp.test(url);
        }
        else {
            return withoutHttp.test(url) ;
        }
    }
};

export default snippetValidations;