import React from 'react';
import ReactDOM from 'react-dom';
// import './content/scss/styles.scss';
import './content/scss/tailwind-output.css';
// import './content/theme/semantic.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
