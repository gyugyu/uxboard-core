import MuiAppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import * as firebase from 'firebase'
import * as React from 'react'
import { IContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'

const styles = (theme: Theme): Record<string, CSSProperties> => ({
  grow: {
    flexGrow: 1
  },
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing.unit * 2
  }
})

interface IInternalProps extends IContextOption {
  classes: Record<string, string>
}

interface IState {
  isLoggedIn: boolean
}

class AppBar extends React.Component<IInternalProps, IState> {
  public state = {
    isLoggedIn: false
  }

  private auth: firebase.auth.Auth

  constructor (props: IInternalProps) {
    super(props)
    this.auth = props.firebase.auth()
  }

  public componentDidMount () {
    this.auth.onAuthStateChanged(user => {
      this.setState({ isLoggedIn: user != null })
    })
  }

  public render () {
    const { classes } = this.props
    const { isLoggedIn } = this.state
    return (
      <div className={classes.root}>
        <MuiAppBar position='static'>
          <Toolbar>
            <Typography variant='title' color='inherit' className={classes.grow}>
              UX Board
            </Typography>
            {isLoggedIn ? (
              <Button color='inherit' onClick={this.handleLogoutClick}>Logout</Button>
            ) : (
              <Button color='inherit' onClick={this.handleLoginClick}>Login</Button>
            )}
          </Toolbar>
        </MuiAppBar>
      </div>
    )
  }

  private handleLoginClick = () => {
    this.auth.signInWithRedirect(this.props.authProvider)
  }

  private handleLogoutClick = () => {
    this.auth.signOut()
  }
}

export default withFirebase<{}>(withStyles(styles)(AppBar))
