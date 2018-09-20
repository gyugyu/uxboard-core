import CardContent from '@material-ui/core/CardContent'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import * as firebase from 'firebase'
import * as React from 'react'
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
  isLoggedIn: boolean
  value: string
}

class EditableLabel extends React.Component<InternalProps, State> {
  private auth: firebase.auth.Auth

  constructor (props: InternalProps) {
    super(props)
    const { initialValue } = props
    this.state = {
      isEditing: initialValue === '',
      isLoggedIn: false,
      value: initialValue
    }
    this.auth = firebase.auth()
  }

  componentWillMount () {
    this.auth.onAuthStateChanged(user => {
      this.setState({ isLoggedIn: user != null })
    })
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
    const { isEditing, isLoggedIn, value } = this.state
    return (
      <CardContent className={definedClasses.card3}>
        {isEditing && isLoggedIn ? (
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
      </CardContent>
    )
  }
}

export default withFirebase<Props>(withStyles(style)(EditableLabel))
