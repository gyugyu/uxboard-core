import Grid from '@material-ui/core/Grid'
import * as React from 'react'
import { IDimension, IIndex } from './interfaces'
import Task from './Task'

interface Props {
  definedClasses: Record<string, string>
  dimension: IDimension
  id: string
  indices: IIndex[]
}

export default class DimensionTasks extends React.Component<Props> {
  render () {
    const { definedClasses, dimension, indices, id } = this.props
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
              taskId = taskIds.find(id => iTasks[id])
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
        </Grid>
      </Grid>
    )
  }
}