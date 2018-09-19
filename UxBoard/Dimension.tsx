import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import * as firebase from 'firebase'
import * as React from 'react'
import EditableLabel from './EditableLabel'
import { IDimension } from './interfaces'

interface Props {
  classes: Record<string, string>
  id: string
  dbRef: firebase.database.Reference
}

interface State extends IDimension {
}

export default class Dimension extends React.Component<Props, State> {
  private dbRef: firebase.database.Reference

  state = {
    name: '',
  }

  constructor (props: Props) {
    super(props)
    const { id, dbRef } = props
    this.dbRef = dbRef.child(id)
  }

  componentWillMount (): void {
    this.dbRef.on('value', snapshot => {
      if (snapshot != null) {
        const dimension = snapshot.val() as IDimension | undefined
        if (dimension != null) {
          this.setState({ ...dimension })
        }
      }
    })
  }

  private handleLeaveEditMode = (name: string): void => {
    this.dbRef.update({ name })
    this.setState({ name })
  }

  render () {
    const { classes } = this.props
    const { name } = this.state
    return (
      <Grid item={true}>
        <Card className={classes.card}>
          <EditableLabel
            classes={classes}
            initialValue={name}
            onLeaveEditMode={this.handleLeaveEditMode}
          />
        </Card>
      </Grid>
    )
  }
}
