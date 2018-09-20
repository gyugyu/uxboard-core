import * as firebase from 'firebase'
import * as React from 'react'

const authProvider = new firebase.auth.GoogleAuthProvider()

export interface IContextOption {
  authProvider: firebase.auth.AuthProvider
  databasePrefix: string
  firebase: typeof firebase
}

export default React.createContext<IContextOption>({
  authProvider,
  databasePrefix: 'uxboard',
  firebase
})
