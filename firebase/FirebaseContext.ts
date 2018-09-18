import firebase from 'firebase'
import React from 'react'

const authProvider = new firebase.auth.GoogleAuthProvider()

export interface ContextOption {
  authProvider: firebase.auth.AuthProvider
  databasePrefix: string
  firebase: typeof firebase
}

export default React.createContext<ContextOption>({
  authProvider,
  databasePrefix: 'uxboard',
  firebase
})
