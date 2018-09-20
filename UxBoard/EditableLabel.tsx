import CardContent from '@material-ui/core/CardContent'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import Auth from '../Auth'
import { ContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'

const style = (_theme: Theme): Record<'textField', CSSProperties> => ({
  textField: {
    width: '100%'
  }
})

interface Props {
  definedClasses: Record<string, string>
  initialValue: string
  onLeaveEditMode: (value: string) => void
}

interface InternalProps extends ContextOption, Props {
  classes: Record<'textField', string>
}

interface State {
  isEditing: boolean
  value: string
}

class EditableLabel extends React.Component<InternalProps, State> {
  constructor (props: InternalProps) {
    super(props)
    const { initialValue } = props
    this.state = {
      isEditing: initialValue === '',
      value: initialValue
    }
  }

  componentWillReceiveProps (newProps: Props) {
    const { initialValue } = newProps
    this.setState({
      isEditing: initialValue === '',
      value: initialValue
    })
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
    const { classes, definedClasses } = this.props
    const { isEditing, value } = this.state
    return (
      <CardContent className={definedClasses.card3}>
        <Auth>
          {user => user && isEditing ? (
            <TextField
              className={classes.textField}
              onChange={evt => this.setState({ value: evt.target.value })}
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
}

export default withFirebase<Props>(withStyles(style)(EditableLabel))
