import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import pink from '@material-ui/core/colors/pink'
import yellow from '@material-ui/core/colors/yellow'
import Grid from '@material-ui/core/Grid'
import firebase from 'firebase'
import React from 'react'
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
}

class Task extends React.Component<InternalProps, State> {
  private taskRef?: firebase.database.Reference

  state = {
    title: '',
    status: TaskStatus.Yet
  }

  private setTaskRef (): void {
    const { databasePrefix, firebase, id } = this.props
    if (id != null && this.taskRef == null) {
      this.taskRef = firebase.database().ref(`${databasePrefix}/tasks`).child(id)
      this.taskRef.on('value', snapshot => {
        if (snapshot != null) {
          this.setState({ ...(snapshot.val() as ITask) })
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
          status
        }
      }
      db.ref().update(updates)
    } else {
      this.taskRef.update({ title })
    }
    this.setState({ title })
  }

  render () {
    const { classes } = this.props
    const { title, status } = this.state
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
            <Button onClick={_evt => {}}>
              Mark as done
            </Button>
          </CardActions>
        </Card>
      </Grid>
    )
  }
}

export default withFirebase<Props>(Task)
