import * as React from 'react'
import {
  ConnectDragPreview,
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DropTarget
} from 'react-dnd'
import { findDOMNode } from 'react-dom'
import DimensionCards from './DimensionCards'
import { IDimension, IIndex } from './interfaces'
import isElement from './isElement'

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

class DimensionCardsWrapper extends React.Component<IProps> {
  public render (): React.ReactNode {
    return (
      <DimensionCards {...this.props} />
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
    connectDragPreview && connectDragSource && connectDropTarget ? <DimensionCardsWrapper
      ref={(instance: DimensionCardsWrapper | null) => {
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
