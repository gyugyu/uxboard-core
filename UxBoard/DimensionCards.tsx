import Grid from '@material-ui/core/Grid'
import * as firebase from 'firebase'
import * as React from 'react'
import Dimension from './Dimension'
import { IDimension, IIndex } from './interfaces'
import Task from './Task'

interface IProps {
  dbRef: firebase.database.Reference
  definedClasses: Record<string, string>
  dimension: IDimension
  id: string
  indices: IIndex[]
}

export default class DimensionCards extends React.Component<IProps> {
  public render (): React.ReactNode {
    const { dbRef, definedClasses, dimension, indices, id } = this.props
    const tasks = dimension.tasks || {}
    const taskIds = Object.keys(tasks).filter(k => tasks[k])
    return (
      <Grid item={true} xs={true}>
        <Grid
          container={true}
          direction='column'
          spacing={16}
        >
          {indices.map((index, i) => {
            let taskId: string | undefined
            const { tasks: iTasks } = index
            if (iTasks != null) {
              taskId = taskIds.find(tid => iTasks[tid])
            }
            return (
              <Task
                definedClasses={definedClasses}
                dimensionId={id}
                key={index.name}
                id={taskId}
                indexId={`${i}`}
              />
            )
          })}
          <Dimension
            definedClasses={definedClasses}
            id={id}
            dbRef={dbRef}
          />
        </Grid>
      </Grid>
    )
  }
}
