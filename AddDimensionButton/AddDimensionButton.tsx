import Button from '@material-ui/core/Button'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import Tooltip from '@material-ui/core/Tooltip'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import AddIcon from '@material-ui/icons/Add'
import * as React from 'react'
import { IContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'

const styles = (theme: Theme): Record<'extendedIcon' | 'root', CSSProperties> => ({
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  root: {
    bottom: 0,
    margin: theme.spacing.unit * 2,
    position: 'fixed',
    right: 0
  }
})

interface IInternalProps extends IContextOption {
  classes: Record<'extendedIcon' | 'root', string>
}

interface IState {
  isLoggedIn: boolean
  order: string[] | undefined
}

class AddDimensionButton extends React.Component<IInternalProps, IState> {
  public state = {
    isLoggedIn: false,
    order: undefined as string[] | undefined
  }

  private auth: firebase.auth.Auth
  private orderRef: firebase.database.Reference

  constructor (props: IInternalProps) {
    super(props)
    const { databasePrefix, firebase: firebaseApp } = props
    this.auth = firebaseApp.auth()
    this.orderRef = firebaseApp.database().ref(`${databasePrefix}/dimensionOrder`)
  }

  public componentWillMount () {
    this.auth.onAuthStateChanged(user => {
      this.setState({ isLoggedIn: user != null })
    })
    this.orderRef.on('value', snapshot => {
      if (snapshot != null) {
        const order = snapshot.val() as string[] | undefined
        this.setState({ order })
      }
    })
  }

  public render (): React.ReactNode {
    const { classes } = this.props
    const { isLoggedIn } = this.state
    return (
      <div className={classes.root}>
        {isLoggedIn ? (
          <Tooltip placement='left' title='Add dimension'>
            <Button
              color='primary'
              onClick={this.handleAddClick}
              variant='fab'
            >
              <AddIcon />
            </Button>
          </Tooltip>
        ) : (
          <Button
            color='primary'
            onClick={this.handleLoginClick}
            variant='extendedFab'
          >
            <AccountCircleIcon className={classes.extendedIcon} />
            Login to add
          </Button>
        )}
      </div>
    )
  }

  private handleLoginClick = () => {
    this.auth.signInWithRedirect(this.props.authProvider)
  }

  private handleAddClick = async (): Promise<void> => {
    const { databasePrefix, firebase: firebaseApp } = this.props
    const { order } = this.state
    const db = firebaseApp.database()
    const newDimensionId = db.ref(`${databasePrefix}/dimensions`).push().key
    const updates: Record<string, { name: '' } | string[]> = {
      [`${databasePrefix}/dimensions/${newDimensionId}`]: { name: '' }
    }
    if (order != null && newDimensionId != null) {
      updates[`${databasePrefix}/dimensionOrder`] = order.concat(newDimensionId)
    }
    await db.ref().update(updates)
  }
}

export default withFirebase<{}>(withStyles(styles)(AddDimensionButton))
