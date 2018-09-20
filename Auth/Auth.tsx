import * as firebase from 'firebase'
import * as React from 'react'
import { IContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'

interface IProps {
  children: (user: firebase.User | null) => React.ReactNode
}

type InternalProps = IContextOption & IProps

interface IState {
  user: firebase.User | null
}

class Auth extends React.Component<InternalProps, IState> {
  public state = {
    user: null
  }

  private auth: firebase.auth.Auth

  constructor (props: InternalProps) {
    super(props)
    this.auth = props.firebase.auth()
  }

  public componentWillMount () {
    this.auth.onAuthStateChanged(user => this.setState({ user }))
  }

  public render () {
    const { children } = this.props
    const { user } = this.state
    return children(user)
  }
}

export default withFirebase<IProps>(Auth)
