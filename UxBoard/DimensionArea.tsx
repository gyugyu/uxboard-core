import Grid from '@material-ui/core/Grid'
import * as firebase from 'firebase'
import * as React from 'react'
import { IContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'
import Dimension from './Dimension'
import DimensionTasks from './DimensionTasks'
import { IDimension, IIndex } from './interfaces'

interface IProps {
  definedClasses: Record<string, string>
  indices: IIndex[]
}

type InternalProps = IContextOption & IProps

interface IState {
  dimensions: Record<string, IDimension>
}

class DimensionArea extends React.Component<InternalProps, IState> {
  public state = {
    dimensions: {} as Record<string, IDimension>
  }

  private dbRef: firebase.database.Reference

  constructor (props: InternalProps) {
    super(props)
    const { databasePrefix, firebase: firebaseApp } = props
    this.dbRef = firebaseApp.database().ref(`${databasePrefix}/dimensions`)
  }

  public componentWillMount () {
    this.dbRef.on('value', snapshot => {
      if (snapshot != null) {
        const dimensions = snapshot.val() as Record<string, IDimension> | undefined
        if (dimensions != null) {
          this.setState({ dimensions })
        }
      }
    })
  }

  public render (): React.ReactNode {
    const { definedClasses, indices } = this.props
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
              className={definedClasses.container}
              container={true}
              spacing={16}
            >
              {Object.keys(dimensions).map(key => {
                return (
                  <DimensionTasks
                    definedClasses={definedClasses}
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
              className={definedClasses.container}
              container={true}
              spacing={16}
            >
              {Object.keys(dimensions).map(key => (
                <Dimension
                  definedClasses={definedClasses}
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

export default withFirebase<IProps>(DimensionArea)
