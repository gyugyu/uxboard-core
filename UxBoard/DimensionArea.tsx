import Grid from '@material-ui/core/Grid'
import firebase from 'firebase'
import React from 'react'
import { ContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'
import Dimension from './Dimension'
import DimensionTasks from './DimensionTasks'
import { IDimension, IIndex } from './interfaces'

interface Props {
  classes: Record<string, string>
  indices: IIndex[]
}

interface InternalProps extends ContextOption, Props {
}

interface State {
  dimensions: Record<string, IDimension>
}

class DimensionArea extends React.Component<InternalProps, State> {
  dbRef: firebase.database.Reference

  constructor (props: InternalProps) {
    super(props)
    const { databasePrefix, firebase } = props
    this.dbRef = firebase.database().ref(`${databasePrefix}/dimensions`)
  }

  componentWillMount () {
    this.dbRef.on('value', snapshot => {
      if (snapshot != null) {
        const dimensions = snapshot.val() as Record<string, IDimension>
        this.setState({ dimensions })
      }
    })
  }

  render () {
    const { classes, indices } = this.props
    const { dimensions } = this.state
    return (
      <Grid item={true}>
        <Grid
          container={true}
          direction='column'
          spacing={16}
        >
          <Grid item={true}>
            <Grid
              className={classes.container}
              container={true}
              spacing={16}
            >
              {Object.keys(dimensions).map(key => {
                return (
                  <DimensionTasks
                    classes={classes}
                    dimension={dimensions[key]}
                    id={key}
                    indices={indices}
                    key={key}
                  />
                )
              })}
            </Grid>
          </Grid>
          <Grid item={true}>
            <Grid
              className={classes.container}
              container={true}
              spacing={16}
            >
              {Object.keys(dimensions).map(key => (
                <Dimension
                  classes={classes}
                  key={key}
                  id={key}
                  dbRef={this.dbRef}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default withFirebase<Props>(DimensionArea)
