import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import lightGreen from '@material-ui/core/colors/lightGreen'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import classnames from 'classnames'
import * as firebase from 'firebase'
import * as React from 'react'
import { ContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'
import EditableLabel from './EditableLabel'
import { IDimension } from './interfaces'

const style = (_theme: Theme): Record<'card', CSSProperties> => ({
  card: {
    backgroundColor: lightGreen.A100
  }
})

interface Props {
  definedClasses: Record<string, string>
  id: string
  dbRef: firebase.database.Reference
}

interface InternalProps extends ContextOption, Props {
  classes: Record<'card', string>
}

interface State extends IDimension {
  anchorEl: EventTarget & HTMLElement | null
  open: boolean
}

class Dimension extends React.Component<InternalProps, State> {
  private dbRef: firebase.database.Reference

  state = {
    anchorEl: null,
    name: '',
    open: false,
    tasks: undefined
  }

  constructor (props: InternalProps) {
    super(props)
    const { id, dbRef } = props
    this.dbRef = dbRef.child(id)
  }

  componentWillMount () {
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

  private handleClickDelete = async (): Promise<void> => {
    const { databasePrefix, firebase, id } = this.props
    const { tasks } = this.state
    let update: Record<string, null> = {
      [`${databasePrefix}/dimensions/${id}`]: null
    }
    if (tasks != null) {
      update = Object.keys(tasks).reduce<Record<string, null>>((pre, cur) => {
        return {
          ...pre,
          [`${databasePrefix}/tasks/${cur}`]: null
        }
      }, update)
    }
    const ref = firebase.database().ref()
    await ref.update(update)
  }

  render () {
    const { classes, definedClasses } = this.props
    const { anchorEl, name, open } = this.state
    return (
      <Grid item={true}>
        <Card className={classnames(definedClasses.card, classes.card)}>
          <EditableLabel
            definedClasses={definedClasses}
            initialValue={name}
            onLeaveEditMode={this.handleLeaveEditMode}
          />
          <CardActions>
            <div>
              <IconButton onClick={evt => this.setState({ anchorEl: evt.currentTarget, open: true })}>
                <MoreVertIcon />
              </IconButton>
              <Menu 
                anchorEl={anchorEl}
                onClose={() => this.setState({ anchorEl: null, open: false })}
                open={open}
              >
                <MenuItem onClick={this.handleClickDelete}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText inset={true} primary='Delete' />
                </MenuItem>
              </Menu>
            </div>
          </CardActions>
        </Card>
      </Grid>
    )
  }
}

export default withFirebase<Props>(withStyles(style)(Dimension))
