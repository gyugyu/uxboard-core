import React from 'react'
import FirebaseContext, { ContextOption } from './FirebaseContext'

export default function withFirebase<T> (
  Component: React.ComponentType<T & ContextOption>
): React.ComponentType<T> {
  class WithFirebase extends React.Component<T> {
    render () {
      return (
        <FirebaseContext.Consumer>
          {(option) => (
            <Component {...this.props} {...option} />
          )}
        </FirebaseContext.Consumer>
      )
    }
  }
  return WithFirebase
}
