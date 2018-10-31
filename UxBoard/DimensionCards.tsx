import Grid from '@material-ui/core/Grid'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import * as React from 'react'
import { ConnectDragSource } from 'react-dnd'
import Dimension from './Dimension'
import { IDimension, IIndex } from './interfaces'
import Task from './Task'

const style: Record<'transparent', CSSProperties> = {
  transparent: {
    opacity: 0
  }
}

interface IProps {
  classes: Record<'transparent', string>
  connectDragSource?: ConnectDragSource
  definedClasses: Record<string, string>
  dimension: IDimension
  id: string
  indices: IIndex[]
  isDragging?: boolean
}

class DimensionCards extends React.Component<IProps> {
  public render (): React.ReactNode {
    const {
      classes,
      connectDragSource,
      definedClasses,
      dimension,
      indices,
      id,
      isDragging
    } = this.props
    const tasks = dimension.tasks || {}
    const taskIds = Object.keys(tasks).filter(k => tasks[k])
    return (
      <Grid
        className={classnames({ [classes.transparent]: isDragging })}
        item={true}
        xs={true}
      >
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

export default withStyles(style)(DimensionCards)
