import Grid from '@material-ui/core/Grid'
import * as firebase from 'firebase'
import * as React from 'react'
import { ConnectDragSource, ConnectDropTarget, DragSource, DropTarget } from 'react-dnd'
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
  index: number
  indices: IIndex[]
  isDragging?: boolean
  onDrop: () => void
  onHover: (dragIndex: number, hoverIndex: number) => void
}

class DimensionCards extends React.Component<IProps> {
  public render (): React.ReactNode {
    const { dbRef, definedClasses, dimension, indices, id, isDragging } = this.props
    const tasks = dimension.tasks || {}
    const taskIds = Object.keys(tasks).filter(k => tasks[k])
    return (
      <Grid item={true} xs={true} style={{ opacity: isDragging ? 0 : 1 }}>
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

interface IMonitoredItem {
  index: number
}

const DIMENSION_TYPE = 'DIMENSION_TYPE'

const isElement = (elem: Element | Text): elem is Element => {
  return elem.nodeType != null
}

const DraggableDimensionCards = DragSource<IProps>(
  DIMENSION_TYPE,
  {
    beginDrag (props): IMonitoredItem {
      return {
        index: props.index
      }
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(props => {
  const { connectDragSource, connectDropTarget } = props
  return (
    connectDragSource && connectDropTarget ? <DimensionCards
      ref={(instance: DimensionCards | null) => {
        if (instance == null) {
          return
        }
        const domNode = findDOMNode(instance)
        if (domNode != null && isElement(domNode)) {
          connectDragSource(domNode)
          connectDropTarget(domNode as any)
        }
        return domNode
      }}
      {...props}
    /> : <React.Fragment />
  )
})

export default DropTarget<IProps>(
  DIMENSION_TYPE,
  {
    drop (props) {
      props.onDrop()
    },
    hover (props, monitor) {
      const dragIndex = (monitor.getItem() as IMonitoredItem).index
      const hoverIndex = props.index
      if (dragIndex === hoverIndex) {
        return
      }
      props.onHover(dragIndex, hoverIndex)
      monitor.getItem().index = hoverIndex
    }
  },
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)(props => <DraggableDimensionCards {...props} />)
