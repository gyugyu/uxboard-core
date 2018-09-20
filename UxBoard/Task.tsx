import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import orange from '@material-ui/core/colors/orange'
import pink from '@material-ui/core/colors/pink'
import yellow from '@material-ui/core/colors/yellow'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import DoneIcon from '@material-ui/icons/Done'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import classnames from 'classnames'
import * as firebase from 'firebase'
import * as React from 'react'
import Auth from '../Auth'
import { IContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'
import EditableLabel from './EditableLabel'
import { TaskStatus } from './interfaces'

const style: Record<'yet' | 'doing' | 'done', CSSProperties> = {
  doing: {
    backgroundColor: orange.A100
  },
  done: {
    backgroundColor: pink.A100
  },
  yet: {
    backgroundColor: yellow.A100
  }
}

interface ITask {
  title: string
  status: TaskStatus
}

interface IProps {
  definedClasses: Record<string, string>
  dimensionId: string
  id?: string
  indexId: string
}

interface IInternalProps extends IContextOption, IProps {
  classes: Record<'yet' | 'doing' | 'done', string>
}

interface IState extends ITask {
  anchorEl: EventTarget & HTMLElement | null
  open: boolean
}

class Task extends React.Component<IInternalProps, IState> {
  public state = {
    anchorEl: null,
    open: false,
    status: TaskStatus.Yet,
    title: ''
  }

  private taskRef?: firebase.database.Reference

  public componentWillMount () {
    this.setTaskRef(this.props)
  }

  public componentWillReceiveProps (newProps: IInternalProps) {
    this.setTaskRef(newProps)
  }

  public render (): React.ReactNode {
    const { classes, definedClasses } = this.props
    const { anchorEl, title, status, open } = this.state
    return (
      <Grid item={true}>
        <Card className={classnames({
          [classes.yet]: status === TaskStatus.Yet,
          [classes.doing]: status === TaskStatus.Doing,
          [classes.done]: status === TaskStatus.Done,
          [definedClasses.card]: true
        })}>
          <EditableLabel
            definedClasses={definedClasses}
            initialValue={title}
            onLeaveEditMode={this.handleLeaveEditMode}
          />
          <Auth>
            {auth => auth && (
              <CardActions>
                {this.taskRef && (
                  <div>
                    <IconButton onClick={this.handleMoreClick}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} onClose={this.handleClose} open={open}>
                      <MenuItem
                        disabled={status === TaskStatus.Yet}
                        onClick={this.createHandleClickMenuItem(TaskStatus.Yet)}
                      >
                        Mark as yet
                      </MenuItem>
                      <MenuItem
                        disabled={status === TaskStatus.Doing}
                        onClick={this.createHandleClickMenuItem(TaskStatus.Doing)}
                      >
                        Mark as doing
                      </MenuItem>
                      <MenuItem
                        disabled={status === TaskStatus.Done}
                        onClick={this.createHandleClickMenuItem(TaskStatus.Done)}
                      >
                        <ListItemIcon>
                          <DoneIcon />
                        </ListItemIcon>
                        <ListItemText inset={true} primary='Mark as done' />
                      </MenuItem>
                    </Menu>
                  </div>
                )}
              </CardActions>
            )}
          </Auth>
        </Card>
      </Grid>
    )
  }

  private setTaskRef (props: IInternalProps): void {
    const { databasePrefix, firebase: firebaseApp, id } = props
    if (id != null && this.taskRef == null) {
      this.taskRef = firebaseApp.database().ref(`${databasePrefix}/tasks`).child(id)
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

  private handleMoreClick = (evt: React.MouseEvent<EventTarget & HTMLElement>) => {
    this.setState({ anchorEl: evt.currentTarget, open: true })
  }

  private handleClose = () => this.setState({ anchorEl: null, open: false })

  private handleLeaveEditMode = async (title: string): Promise<void> => {
    const { databasePrefix, dimensionId, firebase: firebaseApp, indexId } = this.props
    const db = firebaseApp.database()
    if (this.taskRef == null) {
      this.taskRef = db.ref(`${databasePrefix}/tasks`).push()
      const newTaskId = this.taskRef.key
      const updates = {
        [`${databasePrefix}/indices/${indexId}/tasks/${newTaskId}`]: true,
        [`${databasePrefix}/dimensions/${dimensionId}/tasks/${newTaskId}`]: true,
        [`${databasePrefix}/tasks/${newTaskId}`]: {
          status: TaskStatus.Yet,
          title
        }
      }
      await db.ref().update(updates)
    } else {
      await this.taskRef.update({ title })
    }
    this.setState({ title })
  }

  private createHandleClickMenuItem = (status: TaskStatus) => async (): Promise<void> => {
    if (this.taskRef != null) {
      await this.taskRef.update({ status })
    }
    this.setState({ open: false, status })
  }
}

export default withFirebase<IProps>(withStyles(style)(Task))
