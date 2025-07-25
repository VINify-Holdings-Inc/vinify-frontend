class QueryGenerator {
  constructor(state, properties, form) {
    //set into internal properties variable
    this.query = '';
    this.state = state;
    this.properties = properties;
    this.form = form;

    console.log("state, properties, form",state, properties, form);
  }

  generator() {
    for (let i = 0; i < this.properties.length; i++) {
      //   console.log(
      //     this.properties[i].name +
      //       ' : ' +
      //       this.state[this.form][this.properties[i].name].value
      //   );
      if (this.state[this.form][this.properties[i].name].value !== undefined) {
        if (this.properties[i].type == 'object') {
          if (this.state[this.form][this.properties[i].name].value.length > 0)
            this.query += `&${this.properties[i].name}=${this.statesearchForm[
              this.properties[i].name
            ].value.toString()}`;
        } else if (this.properties[i].type == 'int') {
          if (
            this.state[this.form][this.properties[i].name].value != 0 &&
            this.state[this.form][this.properties[i].name].value != 'NaN' &&
            this.state[this.form][this.properties[i].name].value != '-'
          ) {
            this.query += `&${this.properties[i].name}=${parseInt(
              this.state[this.form][this.properties[i].name].value,
              10
            )}`;
          }
        } else if (this.properties[i].type == 'string') {
          if (this.state[this.form][this.properties[i].name].value != '') {
            this.query += `&${this.properties[i].name}=${this.state[this.form][this.properties[i].name].value}`;
          }
        } else {
          if (
            this.state[this.form][this.properties[i].name].value != '' &&
            this.state[this.form][this.properties[i].name].value != '-'
          ) {
            this.query += `&${this.properties[i].name}=${this.state[this.form][
              this.properties[i].name
            ].value == 'true'}`;
          }
        }
      }
    }
    return this.query;
  }
}

export default QueryGenerator;
