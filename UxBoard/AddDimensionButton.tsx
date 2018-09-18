import Button from '@material-ui/core/Button'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import AddIcon from '@material-ui/icons/Add'
import firebase from 'firebase'
import React from 'react'
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

class AddDimensionButton extends React.Component<InternalProps> {
  private dbRef: firebase.database.Reference

  constructor (props: InternalProps) {
    super(props)
    const { databasePrefix, firebase } = props
    this.dbRef = firebase.database().ref(`${databasePrefix}/dimensions`)
  }

  render () {
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
