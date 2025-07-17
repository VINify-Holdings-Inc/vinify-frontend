class QueryParser {
  constructor(query, properties) {
    // Set into internal properties variable
    this.query = query;
    this.properties = properties;
  }

  parse = () => {
    let queryObj;
    let ret;
    this.query = this.query.split(/\?|&/);
    queryObj = this.getProperty(this.query);
    ret = this.checkProperties(queryObj);
    return ret;
  };

  getProperty = query => {
    try {
      let property,
        queryObj = {};
      for (let i = 1; i < query.length; i++) {
        property = query[i].split(/=/);
        queryObj[property[0]] = this.getValue(property[1]);
      }
      return queryObj;
    } catch (ex) {
      return {};
    }
  };

  getValue = value => {
    try {
      // Split by commas and handle single/multiple values
      value = value.split(/,/);
      if (value.length === 1) {
        return value[0]; // Return the value as-is if there's only one element
      }
      return value; // Return the array of values without converting to integers
    } catch (ex) {
      return null;
    }
  };

  checkProperties = queryObj => {
    for (let i = 0; i < this.properties.length; i++) {
      if (!queryObj.hasOwnProperty(this.properties[i].name)) {
        queryObj[this.properties[i].name] = null;
      } else {
        // Process based on the expected type
        if (this.properties[i].type === 'object') {
          queryObj[this.properties[i].name] = [queryObj[this.properties[i].name]];
        } else if (this.properties[i].type === 'int') {
          queryObj[this.properties[i].name] = parseInt(queryObj[this.properties[i].name], 10);
        } else if (this.properties[i].type === 'bool') {
          queryObj[this.properties[i].name] = queryObj[this.properties[i].name] === 'true' ? true : false;
        } else if (this.properties[i].type === 'string') {
          // Ensure the value is a string before calling `.replace()`
          if (typeof queryObj[this.properties[i].name] === 'string') {
            queryObj[this.properties[i].name] = decodeURIComponent(queryObj[this.properties[i].name].replace(/\+/g, ' '));
          } else {
            // If it's not a string, convert it to one
            queryObj[this.properties[i].name] = decodeURIComponent(String(queryObj[this.properties[i].name]).replace(/\+/g, ' '));
          }
        }
      }
    }
    return queryObj;
  };
  
}

export default QueryParser;
