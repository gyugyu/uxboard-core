import Button from '@material-ui/core/Button'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import AddIcon from '@material-ui/icons/Add'
import * as firebase from 'firebase'
import * as React from 'react'
import { ContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'

const styles = (theme: Theme): Record<'fab', CSSProperties> => ({
  fab: {
    right: 0,
    bottom: 0,
    margin: theme.spacing.unit * 2,
    position: 'fixed'
  }
})

interface InternalProps extends ContextOption {
  classes: Record<'fab', string>
}

interface State {
  isLoggedIn: boolean
}

class AddDimensionButton extends React.Component<InternalProps, State> {
  private auth: firebase.auth.Auth
  private dbRef: firebase.database.Reference

  state = {
    isLoggedIn: false
  }

  constructor (props: InternalProps) {
    super(props)
    const { databasePrefix, firebase } = props
    this.auth = firebase.auth()
    this.dbRef = firebase.database().ref(`${databasePrefix}/dimensions`)
  }

  componentWillMount () {
    this.auth.onAuthStateChanged(user => {
      this.setState({ isLoggedIn: user != null })
    })
  }

  render () {
    const { isLoggedIn } = this.state
    if (!isLoggedIn) {
      return
    }
    const { classes } = this.props
    return (
      <Button
        variant='fab'
        color='primary'
        className={classes.fab}
        onClick={() => this.dbRef.push({ name: '' })}
      >
        <AddIcon />
      </Button>
    )
  }
}

export default withFirebase<{}>(withStyles(styles)(AddDimensionButton))
