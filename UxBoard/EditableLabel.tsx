import CardContent from '@material-ui/core/CardContent'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import Auth from '../Auth'

const style: Record<'textField', CSSProperties> = {
  textField: {
    width: '100%'
  }
}

interface IProps {
  classes: Record<'textField', string>
  definedClasses: Record<string, string>
  editing: boolean
  initialValue: string
  onLeaveEditMode: (value: string) => void
}

interface IState {
  open: boolean
  value: string
}

class EditableLabel extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    const { initialValue } = props
    this.state = {
      open: false,
      value: initialValue
    }
  }

  public componentWillReceiveProps (newProps: IProps) {
    const { editing, initialValue } = newProps
    this.setState({
      open: editing ? this.state.open : false,
      value: initialValue
    })
  }

  public render (): React.ReactNode {
    const { classes, definedClasses, editing } = this.props
    const { open, value } = this.state
    return (
      <CardContent className={definedClasses.card3}>
        <Auth>
          {user => user && editing ? (
            <Tooltip
              open={open}
              placement='bottom'
              title='Press Shift+Enter to leave edit mode'
            >
              <TextField
                className={classes.textField}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onKeyUp={this.handleKeyUp}
                value={value}
              />
            </Tooltip>
          ) : (
            <Typography variant='subheading'>
              {value}
            </Typography>
          )}
        </Auth>
      </CardContent>
    )
  }

  private handleBlur = () => {
    const { onLeaveEditMode } = this.props
    const { value } = this.state
    this.setState({ open: false })
    if (value !== '') {
      onLeaveEditMode(value)
    }
  }

  private handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: evt.target.value })
  }

  private handleFocus = () => this.setState({ open: true })

  private handleKeyUp = (evt: React.KeyboardEvent) => {
    const { onLeaveEditMode } = this.props
    const { value } = this.state
    if (evt.keyCode === 13 && evt.shiftKey && value !== '') {
      this.setState({ open: false })
      onLeaveEditMode(value)
    }
  }
}

export default withStyles(style)(EditableLabel)
