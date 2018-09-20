import * as firebase from 'firebase'
import * as React from 'react'
import { ContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'

interface Props {
  children: (user: firebase.User | null) => React.ReactNode
}

type InternalProps = ContextOption & Props

interface State {
  user: firebase.User | null
}

class Auth extends React.Component<InternalProps, State> {
  private auth: firebase.auth.Auth

  state = {
    user: null
  }

  constructor (props: InternalProps) {
    super(props)
    this.auth = props.firebase.auth()
  }

  componentWillMount () {
    this.auth.onAuthStateChanged(user => this.setState({ user }))
  }

  render () {
    const { children } = this.props
    const { user } = this.state
    return children(user)
  }
}

export default withFirebase<Props>(Auth)
