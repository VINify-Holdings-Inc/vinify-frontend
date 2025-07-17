class FormInitializer {
  constructor(state, properties, form) {
    //set into internal properties variable
    this.state = state;
    this.properties = properties;
    this.form = form;
    console.log("state, properties, form",state, properties, form);
  }

  initializer() {
    let keys = Object.keys(this.properties);
    for (let i = 0; i < keys.length; i++) {
      if (this.properties[keys[i]] != null) {
        this.state[this.form][keys[i]].value = this.properties[keys[i]];
      }
    }
  }
}

export default FormInitializer;
