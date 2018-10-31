import Grid from '@material-ui/core/Grid'
import * as React from 'react'
import {
  ConnectDragPreview,
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DropTarget
} from 'react-dnd'
import { findDOMNode } from 'react-dom'
import Dimension from './Dimension'
import { IDimension, IIndex } from './interfaces'
import isElement from './isElement'
import Task from './Task'

interface IProps {
  connectDragPreview?: ConnectDragPreview
  connectDragSource?: ConnectDragSource
  connectDropTarget?: ConnectDropTarget
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
    const { connectDragSource, definedClasses, dimension, indices, id, isDragging } = this.props
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
            connectDragSource={connectDragSource}
            definedClasses={definedClasses}
            id={id}
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
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(props => {
  const { connectDragPreview, connectDragSource, connectDropTarget } = props
  return (
    connectDragPreview && connectDragSource && connectDropTarget ? <DimensionCards
      ref={(instance: DimensionCards | null) => {
        if (instance == null) {
          return
        }
        const domNode = findDOMNode(instance)
        if (domNode != null && isElement(domNode)) {
          connectDragPreview(domNode)
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
