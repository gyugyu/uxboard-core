import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import * as colors from '@material-ui/core/colors'
import orange from '@material-ui/core/colors/orange'
import pink from '@material-ui/core/colors/pink'
import yellow from '@material-ui/core/colors/yellow'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import Tooltip from '@material-ui/core/Tooltip'
import BrushIcon from '@material-ui/icons/Brush'
import DoneIcon from '@material-ui/icons/Done'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import classnames from 'classnames'
import * as firebase from 'firebase'
import * as React from 'react'
import Auth from '../Auth'
import { IContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'
import EditableLabel from './EditableLabel'
import { TaskStatus } from './interfaces'

const borderColors = Object.keys(colors).map(k => (colors as any)[k][200])

const style = (theme: Theme): Record<'avatarButton' | 'border' | 'doing' | 'done' | 'inset' | 'row' | 'yet', CSSProperties> => ({
  avatarButton: {
    margin: theme.spacing.unit
  },
  border: {
    borderStyle: 'solid',
    borderWidth: theme.spacing.unit
  },
  doing: {
    backgroundColor: orange[100]
  },
  done: {
    backgroundColor: pink[100]
  },
  inset: {
    margin: -1 * theme.spacing.unit
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 384
  },
  yet: {
    backgroundColor: yellow[100]
  }
})

interface ITask {
  color?: string
  status: TaskStatus
  title: string
}

interface IProps {
  definedClasses: Record<string, string>
  dimensionId: string
  id?: string
  indexId: string
}

interface IInternalProps extends IContextOption, IProps {
  classes: Record<'avatarButton' | 'border' | 'doing' | 'done' | 'inset' | 'row' | 'yet', string>
}

interface IState extends ITask {
  anchorEl: EventTarget & HTMLElement | null
  editing: boolean
  openMenu: boolean
  openPalette: boolean
  openTooltip: boolean
}

class Task extends React.Component<IInternalProps, IState> {
  public state = {
    anchorEl: null,
    color: undefined as string | undefined,
    editing: true,
    openMenu: false,
    openPalette: false,
    openTooltip: false,
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
    const {
      anchorEl,
      color,
      editing,
      openMenu,
      openPalette,
      openTooltip,
      status,
      title
    } = this.state
    return (
      <Grid item={true}>
        <Tooltip
          open={openTooltip}
          placement='bottom'
          title='Double click to edit'
        >
          <Card
            className={classnames({
              [classes.yet]: status === TaskStatus.Yet,
              [classes.doing]: status === TaskStatus.Doing,
              [classes.done]: status === TaskStatus.Done,
              [definedClasses.card]: true,
              [definedClasses.cursorPointer]: !editing
            })}
            onClick={this.handleCardClick}
            onDoubleClick={this.handleCardDoubleClick}
          >
            <div
              className={classnames({ [classes.border]: color != null })}
              style={{ borderColor: color }}
            >
              <div className={classnames({ [classes.inset]: color != null })}>
                <EditableLabel
                  definedClasses={definedClasses}
                  editing={editing}
                  initialValue={title}
                  onLeaveEditMode={this.handleLeaveEditMode}
                />
                <Auth>
                  {auth => auth && (
                    <CardActions>
                      {this.taskRef && (
                        <React.Fragment>
                          <IconButton onClick={this.handleBrushClick}>
                            <BrushIcon />
                          </IconButton>
                          <Popover anchorEl={anchorEl} onClose={this.handleClose} open={openPalette}>
                            <div className={classes.row}>
                              <IconButton
                                className={classes.avatarButton}
                                onClick={this.buildHandleAvatarClick()}
                              >
                                <HighlightOffIcon />
                              </IconButton>
                              {borderColors.map(c => (
                                <IconButton
                                  className={classes.avatarButton}
                                  onClick={this.buildHandleAvatarClick(c)}
                                >
                                  <Avatar style={{ backgroundColor: c }} />
                                </IconButton>
                              ))}
                            </div>
                          </Popover>
                          <IconButton onClick={this.handleMoreClick}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu anchorEl={anchorEl} onClose={this.handleClose} open={openMenu}>
                            <MenuItem
                              disabled={status === TaskStatus.Yet}
                              onClick={this.buildHandleClickMenuItem(TaskStatus.Yet)}
                            >
                              Mark as yet
                            </MenuItem>
                            <MenuItem
                              disabled={status === TaskStatus.Doing}
                              onClick={this.buildHandleClickMenuItem(TaskStatus.Doing)}
                            >
                              Mark as doing
                            </MenuItem>
                            <MenuItem
                              disabled={status === TaskStatus.Done}
                              onClick={this.buildHandleClickMenuItem(TaskStatus.Done)}
                            >
                              <ListItemIcon>
                                <DoneIcon />
                              </ListItemIcon>
                              <ListItemText inset={true} primary='Mark as done' />
                            </MenuItem>
                          </Menu>
                        </React.Fragment>
                      )}
                    </CardActions>
                  )}
                </Auth>
              </div>
            </div>
          </Card>
        </Tooltip>
      </Grid>
    )
  }

  private setTaskRef (props: IInternalProps) {
    const { databasePrefix, firebase: firebaseApp, id } = props
    if (id != null && this.taskRef == null) {
      this.taskRef = firebaseApp.database().ref(`${databasePrefix}/tasks`).child(id)
      this.taskRef.on('value', snapshot => {
        if (snapshot != null) {
          const task = snapshot.val() as ITask | undefined
          if (task != null) {
            this.setState({ ...task, editing: task.title === '' })
          }
        }
      })
    }
  }

  private handleCardClick = () => {
    const { editing } = this.state
    if (!editing) {
      setTimeout(() => this.setState({ openTooltip: false }), 3000)
      this.setState({ openTooltip: true })
    }
  }

  private handleCardDoubleClick = () => this.setState({ editing: true, openTooltip: false })

  private handleBrushClick = (evt: React.MouseEvent<EventTarget & HTMLElement>) => {
    this.setState({ anchorEl: evt.currentTarget, openPalette: true })
  }

  private buildHandleAvatarClick = (color?: string) => async (): Promise<void> => {
    if (this.taskRef != null) {
      await this.taskRef.update({ color: color ? color : null })
    }
    this.setState({ color, openPalette: false })
  }

  private handleMoreClick = (evt: React.MouseEvent<EventTarget & HTMLElement>) => {
    this.setState({ anchorEl: evt.currentTarget, openMenu: true })
  }

  private handleClose = () => this.setState({ anchorEl: null, openMenu: false, openPalette: false })

  private handleLeaveEditMode = async (title: string): Promise<void> => {
    const { databasePrefix, dimensionId, firebase: firebaseApp, indexId } = this.props
    if (this.state.title === title) {
      this.setState({ editing: false })
      return
    }
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
    this.setState({ editing: false, title })
  }

  private buildHandleClickMenuItem = (status: TaskStatus) => async (): Promise<void> => {
    if (this.taskRef != null) {
      await this.taskRef.update({ status })
    }
    this.setState({ openMenu: false, status })
  }
}

export default withFirebase<IProps>(withStyles(style)(Task))
