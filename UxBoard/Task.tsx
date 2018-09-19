import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import pink from '@material-ui/core/colors/pink'
import yellow from '@material-ui/core/colors/yellow'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import * as firebase from 'firebase'
import * as React from 'react'
import { ContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'
import { TaskStatus } from './interfaces'
import EditableLabel from './EditableLabel'

const style = {
  yet: {
    backgroundColor: yellow.A100
  },
  done: {
    backgroundColor: pink.A100
  }
}

interface ITask {
  title: string
  status: TaskStatus
}

interface Props {
  classes: Record<string, string>
  dimensionId: string
  id?: string
  indexId: string
}

interface InternalProps extends Props, ContextOption {
}

interface State extends ITask {
  anchorEl: EventTarget & HTMLElement | null
  open: boolean
}

class Task extends React.Component<InternalProps, State> {
  private taskRef?: firebase.database.Reference

  state = {
    anchorEl: null,
    title: '',
    open: false,
    status: TaskStatus.Yet
  }

  private setTaskRef (): void {
    const { databasePrefix, firebase, id } = this.props
    if (id != null && this.taskRef == null) {
      this.taskRef = firebase.database().ref(`${databasePrefix}/tasks`).child(id)
      this.taskRef.on('value', snapshot => {
        if (snapshot != null) {
          const task = snapshot.val() as ITask | undefined
          if (task != null) {
            this.setState({ ...task })
          }
        }
      })
    }
  }

  componentWillMount () {
    this.setTaskRef()
  }

  componentWillReceiveProps () {
    this.setTaskRef()
  }

  private handleLeaveEditMode = (title: string): void => {
    const { databasePrefix, dimensionId, firebase, indexId } = this.props
    const db = firebase.database()
    if (this.taskRef == null) {
      this.taskRef = db.ref(`${databasePrefix}/tasks`).push()
      const newTaskId = this.taskRef.key
      const updates = {
        [`${databasePrefix}/indices/${indexId}/tasks/${newTaskId}`]: true,
        [`${databasePrefix}/dimensions/${dimensionId}/tasks/${newTaskId}`]: true,
        [`${databasePrefix}/tasks/${newTaskId}`]: {
          title,
          status: TaskStatus.Yet
        }
      }
      db.ref().update(updates)
    } else {
      this.taskRef.update({ title })
    }
    this.setState({ title })
  }

  private createHandleClickMenuItem = (status: TaskStatus) => (): void => {
    if (this.taskRef != null) {
      this.taskRef.update({ status })
    }
    this.setState({ open: false, status })
  }

  render () {
    const { classes } = this.props
    const { anchorEl, title, status, open } = this.state
    return (
      <Grid item={true}>
        <Card
          style={status === TaskStatus.Yet ? style.yet : style.done}
          className={classes.card2}
        >
          <EditableLabel
            classes={classes}
            initialValue={title}
            onLeaveEditMode={this.handleLeaveEditMode}
          />
          <CardActions>
            {this.taskRef && (
              <div>
                <IconButton onClick={evt => this.setState({ anchorEl: evt.currentTarget, open: true })}>
                  <MoreVertIcon />
                </IconButton>
                <Menu 
                  anchorEl={anchorEl}
                  onClose={() => this.setState({ anchorEl: null, open: false })}
                  open={open}
                >
                  {status !== TaskStatus.Yet && (
                    <MenuItem onClick={this.createHandleClickMenuItem(TaskStatus.Yet)}>
                      Mark as yet
                    </MenuItem>
                  )}
                  {status !== TaskStatus.Doing && (
                    <MenuItem onClick={this.createHandleClickMenuItem(TaskStatus.Doing)}>
                      Mark as doing
                    </MenuItem>
                  )}
                  {status !== TaskStatus.Done && (
                    <MenuItem onClick={this.createHandleClickMenuItem(TaskStatus.Done)}>
                      Mark as done
                    </MenuItem>
                  )}
                </Menu>
              </div>
            )}
          </CardActions>
        </Card>
      </Grid>
    )
  }
}

export default withFirebase<Props>(Task)
