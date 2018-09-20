import Button from '@material-ui/core/Button'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import AddIcon from '@material-ui/icons/Add'
import * as React from 'react'
import Auth from '../Auth'
import { IContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'

const styles = (theme: Theme): Record<'fab', CSSProperties> => ({
  fab: {
    bottom: 0,
    margin: theme.spacing.unit * 2,
    position: 'fixed',
    right: 0
  }
})

interface IInternalProps extends IContextOption {
  classes: Record<'fab', string>
}

class AddDimensionButton extends React.Component<IInternalProps> {
  private dbRef: firebase.database.Reference

  constructor (props: IInternalProps) {
    super(props)
    const { databasePrefix, firebase } = props
    this.dbRef = firebase.database().ref(`${databasePrefix}/dimensions`)
  }

  public render () {
    const { classes } = this.props
    return (
      <Auth>
        {user => user && (
          <Button
            variant='fab'
            color='primary'
            className={classes.fab}
            onClick={this.handleClick}
          >
            <AddIcon />
          </Button>
        )}
      </Auth>
    )
  }

  private handleClick = async (): Promise<void> => {
    await this.dbRef.push({ name: '' })
  }
}

export default withFirebase<{}>(withStyles(styles)(AddDimensionButton))
