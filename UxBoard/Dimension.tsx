import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import lightGreen from '@material-ui/core/colors/lightGreen'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ReorderIcon from '@material-ui/icons/Reorder'
import classnames from 'classnames'
import * as firebase from 'firebase'
import * as React from 'react'
import Auth from '../Auth'
import { IContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'
import EditableLabel from './EditableLabel'
import { IDimension } from './interfaces'

const style: Record<'card', CSSProperties> = {
  card: {
    backgroundColor: lightGreen.A100
  }
}

interface IProps {
  definedClasses: Record<string, string>
  id: string
  dbRef: firebase.database.Reference
}

interface IInternalProps extends IContextOption, IProps {
  classes: Record<'card', string>
}

interface IState extends IDimension {
  anchorEl: EventTarget & HTMLElement | null
  editing: boolean
  openMenu: boolean
  openTooltip: boolean
}

class Dimension extends React.Component<IInternalProps, IState> {
  public state = {
    anchorEl: null,
    editing: true,
    name: '',
    openMenu: false,
    openTooltip: false,
    tasks: undefined
  }

  private dbRef: firebase.database.Reference

  constructor (props: IInternalProps) {
    super(props)
    const { id, dbRef } = props
    this.dbRef = dbRef.child(id)
  }

  public componentWillMount () {
    this.dbRef.on('value', snapshot => {
      if (snapshot != null) {
        const dimension = snapshot.val() as IDimension | undefined
        if (dimension != null) {
          this.setState({ ...dimension, editing: dimension.name === '' })
        }
      }
    })
  }

  public render () {
    const { classes, definedClasses } = this.props
    const { anchorEl, editing, name, openMenu, openTooltip } = this.state
    return (
      <Grid item={true}>
        <Tooltip
          placement='top'
          open={openTooltip}
          title='Double click to edit'
        >
          <Card
            className={classnames({
              [classes.card]: true,
              [definedClasses.card]: true,
              [definedClasses.cursorPointer]: !editing
            })}
            onClick={this.handleCardClick}
            onDoubleClick={this.handleCardDoubleClick}>
            <EditableLabel
              definedClasses={definedClasses}
              editing={editing}
              initialValue={name}
              onLeaveEditMode={this.handleLeaveEditMode}
            />
            <Auth>
              {user => user && (
                <CardActions>
                  <div>
                    <IconButton>
                      <ReorderIcon />
                    </IconButton>
                    <IconButton onClick={this.handleMoreClick}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} onClose={this.handleClose} open={openMenu}>
                      <MenuItem onClick={this.handleDeleteClick}>
                        <ListItemIcon>
                          <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText inset={true} primary='Delete' />
                      </MenuItem>
                    </Menu>
                  </div>
                </CardActions>
              )}
            </Auth>
          </Card>
        </Tooltip>
      </Grid>
    )
  }

  private handleCardClick = () => {
    const { editing } = this.state
    if (!editing) {
      setTimeout(() => this.setState({ openTooltip: false }), 3000)
      this.setState({ openTooltip: true })
    }
  }

  private handleCardDoubleClick = () => this.setState({ editing: true, openTooltip: false })

  private handleLeaveEditMode = async (name: string): Promise<void> => {
    if (this.state.name !== name) {
      await this.dbRef.update({ name })
    }
    this.setState({ editing: false, name })
  }

  private handleMoreClick = (evt: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: evt.currentTarget, openMenu: true })
  }

  private handleClose = () => this.setState({ anchorEl: null, openMenu: false })

  private handleDeleteClick = async (): Promise<void> => {
    const { databasePrefix, firebase: firebaseApp, id } = this.props
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
    const ref = firebaseApp.database().ref()
    await ref.update(update)
  }
}

export default withFirebase<IProps>(withStyles(style)(Dimension))
