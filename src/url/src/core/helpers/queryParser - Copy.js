class QueryParser {
  constructor(query, properties) {
    //set into internal properties variable
    this.query = query;
    this.properties = properties;
    console.log("query, properties",query, properties);
  }

  parse = () => {
    let queryObj;
    let ret;
    this.query = this.query.split(/\?|&/);
    queryObj = this.getProperty(this.query);
    ret= this.checkProperties(queryObj);
    console.log("ret",ret);
    return ret;
  };

  getProperty = query => {
    try {
      let property,
        queryObj = {};
      for (let i = 1; i < query.length; i++) {
        property = query[i].split(/=/);
        this.getValue(property[1]);
        queryObj[property[0]] = this.getValue(property[1]);
      }
      return queryObj;
    } catch (ex) {
      return {};
    }
  };

  getValue = value => {
    try {
      value = value.split(/,/);
      if (value.length == 1) {
        return value[0];
      }
      return value.map(val => parseInt(val, 10));
    } catch (ex) {
      return null;
    }
  };

  checkProperties = queryObj => {
    for (let i = 0; i < this.properties.length; i++) {
      if (!queryObj.hasOwnProperty(this.properties[i].name)) {
        queryObj[this.properties[i].name] = null;
      } else {
        if (
          typeof queryObj[this.properties[i].name] !== this.properties[i].type
        ) {
          if (this.properties[i].type == 'object')
            queryObj[this.properties[i].name] = [
              parseInt(queryObj[this.properties[i].name], 10)
            ];
          else if (this.properties[i].type == 'int')
            queryObj[this.properties[i].name] = parseInt(
              queryObj[this.properties[i].name],
              10
            );
          else {
            queryObj[this.properties[i].name] = (
              queryObj[this.properties[i].name] == 'true'
            ).toString();
          }
        } else if (typeof queryObj[this.properties[i].name] == 'string') {
          let arr = queryObj[this.properties[i].name].split('%20');
          let val = arr[0];
          for (let j = 1; j < arr.length; j++) val += ' ' + arr[j];
          queryObj[this.properties[i].name] = val;
        }
      }
    }
    return queryObj;
  };
}

export default QueryParser;
