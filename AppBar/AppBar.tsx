import MuiAppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import firebase from 'firebase'
import React from 'react'
import { ContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'

const styles = (theme: Theme): Record<string, CSSProperties> => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing.unit * 2
  },
  grow: {
    flexGrow: 1
  }
})

interface InternalProps extends ContextOption {
  classes: Record<string, string>
}

interface State {
  isLoggedIn: boolean
}

class AppBar extends React.Component<InternalProps, State> {
  private auth: firebase.auth.Auth

  constructor (props: InternalProps) {
    super(props)
    this.auth = props.firebase.auth()
  }

  state = {
    isLoggedIn: false
  }

  componentDidMount () {
    this.auth.onAuthStateChanged(user => {
      this.setState({ isLoggedIn: user != null })
    })
  }

  private handleLoginClick = () => {
    this.auth.signInWithRedirect(this.props.authProvider)
  }

  render () {
    const { classes } = this.props
    const { isLoggedIn } = this.state
    return (
      <div className={classes.root}>
        <MuiAppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.grow}>
              UX Board
            </Typography>
            {isLoggedIn ? (
              <Button color="inherit" onClick={() => this.auth.signOut()}>Logout</Button>
            ) : (
              <Button color="inherit" onClick={this.handleLoginClick}>Login</Button>
            )}
          </Toolbar>
        </MuiAppBar>
      </div>
    )
  }
}

export default withFirebase<{}>(withStyles(styles)(AppBar))
