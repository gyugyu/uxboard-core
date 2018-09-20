import CardContent from '@material-ui/core/CardContent'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
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
  initialValue: string
  onLeaveEditMode: (value: string) => void
}

interface IState {
  isEditing: boolean
  value: string
}

class EditableLabel extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    const { initialValue } = props
    this.state = {
      isEditing: initialValue === '',
      value: initialValue
    }
  }

  public componentWillReceiveProps (newProps: IProps) {
    const { initialValue } = newProps
    this.setState({
      isEditing: initialValue === '',
      value: initialValue
    })
  }

  public render (): React.ReactNode {
    const { classes, definedClasses } = this.props
    const { isEditing, value } = this.state
    return (
      <CardContent className={definedClasses.card3}>
        <Auth>
          {user => user && isEditing ? (
            <TextField
              className={classes.textField}
              onChange={this.handleChange}
              onKeyUp={this.handleKeyUp}
              value={value}
            />
          ) : (
            <Typography variant='subheading' onDoubleClick={this.handleDoubleClick}>
              {value}
            </Typography>
          )}
        </Auth>
      </CardContent>
    )
  }

  private handleDoubleClick = () => this.setState({ isEditing: true })

  private handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: evt.target.value })
  }

  private handleKeyUp = (evt: React.KeyboardEvent): void => {
    const { onLeaveEditMode } = this.props
    const { value } = this.state
    if (evt.keyCode === 13 && evt.shiftKey && value !== '') {
      this.setState({ isEditing: false })
      onLeaveEditMode(value)
    }
  }
}

export default withStyles(style)(EditableLabel)
