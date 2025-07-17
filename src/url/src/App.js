import React, { Component, Fragment } from 'react';
import store from './store/createStore';
import Routes from './Routes';
import { Provider } from 'react-redux';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}

export default App;
