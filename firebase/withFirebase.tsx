import * as React from 'react'
import FirebaseContext, { IContextOption } from './FirebaseContext'

export default function withFirebase<T> (
  Component: React.ComponentType<T & IContextOption>
): React.ComponentType<T> {
  class WithFirebase extends React.Component<T> {
    public render () {
      return (
        <FirebaseContext.Consumer>
          {option => (
            <Component {...this.props} {...option} />
          )}
        </FirebaseContext.Consumer>
      )
    }
  }
  return WithFirebase
}
