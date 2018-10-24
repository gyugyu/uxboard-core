import Grid from '@material-ui/core/Grid'
import * as firebase from 'firebase'
import * as React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'
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

class DimensionCards extends React.Component<IProps> {
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

const DIMENSION_TYPE = 'DIMENSION_TYPE'

const Ds = DragSource<IProps>(
  DIMENSION_TYPE,
  {
    beginDrag (props) {
      return props
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)((props: any) => {
  const { connectDragSource } = props
  return (
    <DimensionCards
      ref={(instance: React.ReactInstance) => connectDragSource(findDOMNode(instance))}
      {...props}
    />
  )
})

export default DropTarget<IProps>(
  DIMENSION_TYPE,
  {
  },
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)((props: any) => {
  const { connectDropTarget } = props
  return (
    <Ds
      ref={(instance: React.ReactInstance) => connectDropTarget(findDOMNode(instance))}
      {...props}
    />
  )
})
