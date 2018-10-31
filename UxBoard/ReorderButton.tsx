import IconButton from '@material-ui/core/IconButton'
import ReorderIcon from '@material-ui/icons/Reorder'
import * as React from 'react'

export default class ReorderButton extends React.Component {
  public render (): React.ReactNode {
    return (
      <IconButton>
        <ReorderIcon />
      </IconButton>
    )
  }
}
