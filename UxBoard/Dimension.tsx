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
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
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
  open: boolean
}

class Dimension extends React.Component<IInternalProps, IState> {
  public state = {
    anchorEl: null,
    name: '',
    open: false,
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
          this.setState({ ...dimension })
        }
      }
    })
  }

  public render () {
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
          <Auth>
            {user => user && (
              <CardActions>
                <div>
                  <IconButton onClick={this.handleMoreClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu anchorEl={anchorEl} onClose={this.handleClose} open={open}>
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
      </Grid>
    )
  }

  private handleLeaveEditMode = (name: string) => {
    this.dbRef.update({ name })
    this.setState({ name })
  }

  private handleMoreClick = (evt: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: evt.currentTarget, open: true })
  }

  private handleClose = () => this.setState({ anchorEl: null, open: false })

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
