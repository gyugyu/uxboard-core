import Grid from '@material-ui/core/Grid'
import * as firebase from 'firebase'
import * as React from 'react'
import {
  ConnectDragSource,
  ConnectDropTarget,
  DndComponent,
  DragSource,
  DropTarget
} from 'react-dnd'
import { findDOMNode } from 'react-dom'
import Dimension from './Dimension'
import { IDimension, IIndex } from './interfaces'
import Task from './Task'

interface IProps {
  connectDragSource?: ConnectDragSource
  connectDropTarget?: ConnectDropTarget
  dbRef: firebase.database.Reference
  definedClasses: Record<string, string>
  dimension: IDimension
  id: string
  indices: IIndex[]
  isDragging?: boolean
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

const isElement = (elem: Element | Text): elem is Element => {
  return elem.nodeType != null
}

const DraggableDimensionCards = DragSource<IProps>(
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
)(props => {
  const { connectDragSource } = props
  return (
    connectDragSource ? <DimensionCards
      ref={(instance: DimensionCards | null) => {
        if (instance == null) {
          return
        }
        const domNode = findDOMNode(instance)
        if (domNode != null && isElement(domNode)) {
          return connectDragSource(domNode)
        }
        return
      }}
      {...props}
    /> : <React.Fragment />
  )
})

const isReactElement = <T extends {}>(elem: any): elem is React.ReactElement<T> => {
  return elem.props != null
}

export default DropTarget<IProps>(
  DIMENSION_TYPE,
  {
  },
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)(props => {
  const { connectDropTarget } = props
  return (
    connectDropTarget ? <DraggableDimensionCards
      ref={(instance: DndComponent<IProps> | null) => { 
        if (instance == null) {
          return
        }
        const domNode = findDOMNode(instance)
        if (domNode != null && isReactElement(domNode)) {
          return connectDropTarget(domNode)
        }
        return
      }}
      {...props}
    /> : <React.Fragment />
  )
})
