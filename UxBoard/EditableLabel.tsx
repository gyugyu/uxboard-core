import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'

interface Props {
  definedClasses: Record<string, string>
  initialValue: string
  onLeaveEditMode: (value: string) => void
}

interface State {
  isEditing: boolean
  value: string
}

export default class EditableLabel extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.setStateFromProps(props)
  }

  componentWillReceiveProps (newProps: Props): void {
    this.setStateFromProps(newProps)
  }

  private setStateFromProps (props: Props): void {
    const { initialValue } = props
    this.state = {
      isEditing: initialValue === '',
      value: initialValue
    }
  }

  private handleDoubleClick = () => this.setState({ isEditing: true })

  private handleKeyUp = (evt: React.KeyboardEvent): void => {
    const { onLeaveEditMode } = this.props
    const { value } = this.state
    if (evt.keyCode === 13 && evt.shiftKey && value !== '') {
      this.setState({ isEditing: false })
      onLeaveEditMode(value)
    }
  }

  render () {
    const { definedClasses } = this.props
    const { isEditing, value } = this.state
    return (
      <CardContent className={definedClasses.card3}>
        {isEditing ? (
          <TextField
            value={value}
            onKeyUp={this.handleKeyUp}
            onChange={evt => this.setState({ value: evt.target.value })}
          />
        ) : (
          <Typography variant='title' onDoubleClick={this.handleDoubleClick}>
            {value}
          </Typography>
        )}
      </CardContent>
    )
  }
}
