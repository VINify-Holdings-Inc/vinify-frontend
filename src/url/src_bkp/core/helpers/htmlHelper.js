const htmlHelper = {
    getStatus: (status) => {
        if (status >= 200 && status < 300)
            return 200;
        else if (status >= 300 && status < 400)
            return 300;
        else if (status >= 300 && status < 500)
            return 400;
        else
            return 500;
    }
}

export const toQueryString = (obj) => {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

export default htmlHelper;