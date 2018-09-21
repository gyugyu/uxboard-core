# uxboard-core
📋 UX achivement visualization tool

## IMPORTANT

This repository is maintained as subtree of [tech/uxboard](https://git.pepabo.com/tech/uxboard). **DO NOT MODIFY THIS REPOSITORY DIRECTLY.**

## Requirements

* Node (>= 8.0.0)

## Installation

### Using yarnpkg

```bash
$ yarn global add create-react-app
$ create-react-app your-app-name
$ cd your-app-name
$ yarn add firebase @material-ui/core @material-ui/icons
$ yarn add 'git+https://git.pepabo.com/tech/uxboard-core#v1.0.0-95e01f4'
$ cat << EOS
{
  "databasePrefix": "uxboard",
  "firebase": {
    "apiKey": "yourFirebaseApiKey",
    "authDomain": "your-auth-domain.firebaseapp.com",
    "databaseURL": "https://your-database-url.firebaseio.com"
  }
}
EOS > src/uxboard.json
$ node_modules/.bin/uxboardify ./src/uxboard.json
```

### Using npm

```bash
$ npm install -g create-react-app
$ create-react-app your-app-name
$ cd your-app-name
$ npm install -s firebase @material-ui/core @material-ui/icons
$ npm install -s 'git+https://git.pepabo.com/tech/uxboard-core#v1.0.0-95e01f4'
$ cat << EOS
{
  "databasePrefix": "uxboard",
  "firebase": {
    "apiKey": "yourFirebaseApiKey",
    "authDomain": "your-auth-domain.firebaseapp.com",
    "databaseURL": "https://your-database-url.firebaseio.com"
  }
}
EOS > src/uxboard.json
$ node_modules/.bin/uxboardify ./src/uxboard.json
```

## Usage

### index.js

```js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import React from 'react';
import ReactDOM from 'react-dom';
import FirebaseContext from 'uxboard-core/firebase/FirebaseContext';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import config from './uxboard.json'

firebase.initializeApp(config.firebase)
const authProvider = new firebase.auth.GoogleAuthProvider()
authProvider.setCustomParameters({ hd: 'pepabo.com' })

ReactDOM.render(
  <FirebaseContext.Provider
    value={{
      authProvider,
      databasePrefix: config.databasePrefix,
      firebase
    }}
  >
    <App />
  </FirebaseContext.Provider>, document.getElementById('root'));
registerServiceWorker();
```

### App.js

```js
import React, { Component, Fragment } from 'react';
import AddDimensionButton from 'uxboard-core/AddDimensionButton';
import AppBar from 'uxboard-core/AppBar'; // optional
import UxBoard from 'uxboard-core/UxBoard';

class App extends Component {
  render() {
    return (
      <Fragment>
        <AppBar title='UX Board' />
        <UxBoard />
        <AddDimensionButton />
      </Fragment>
    );
  }
}

export default App;
```

Then `npm(yarn) start`.

## Publish

### GitHub Pages

Add your GitHub Pages URL to `"homepage"` at package.json. Then,

```bash
$ yarn add -D gh-pages
$ yarn build
$ node_modules/.bin/gh-pages -d build

# or

$ npm install -D gh-pages
$ npm run build
$ node_modules/.bin/gh-pages -d build
```
