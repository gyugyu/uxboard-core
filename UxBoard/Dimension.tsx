import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import lightGreen from '@material-ui/core/colors/lightGreen'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import * as firebase from 'firebase'
import * as React from 'react'
import EditableLabel from './EditableLabel'
import { IDimension } from './interfaces'

const style = (_theme: Theme): Record<'card', CSSProperties> => ({
  card: {
    backgroundColor: lightGreen.A100
  }
})

interface Props {
  classes: Record<'card', string>
  definedClasses: Record<string, string>
  id: string
  dbRef: firebase.database.Reference
}

interface State extends IDimension {
}

class Dimension extends React.Component<Props, State> {
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
    const { classes, definedClasses } = this.props
    const { name } = this.state
    return (
      <Grid item={true}>
        <Card className={classnames(definedClasses.card, classes.card)}>
          <EditableLabel
            definedClasses={definedClasses}
            initialValue={name}
            onLeaveEditMode={this.handleLeaveEditMode}
          />
        </Card>
      </Grid>
    )
  }
}

export default withStyles(style)(Dimension)
