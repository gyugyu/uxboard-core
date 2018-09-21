import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import classnames from 'classnames'
import * as firebase from 'firebase'
import * as React from 'react'
import { IContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'
import DimensionArea from './DimensionArea'
import { IIndex } from './interfaces'

const styles: Record<string, CSSProperties> = {
  board: {
    overflowX: 'scroll',
    overflowY: 'hidden'
  },
  card: {
    height: 120,
    overflowX: 'hidden',
    overflowY: 'scroll',
    width: 240
  },
  container: {
    flexWrap: 'nowrap'
  },
  cursorPointer: {
    cursor: 'pointer'
  },
  flexCenter: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  noShadow: {
    boxShadow: 'none'
  },
  root: {
    flexGrow: 1
  }
}

interface IInternalProps extends IContextOption {
  classes: Record<string, string>
}

interface IState {
  indices: IIndex[]
}

class App extends React.Component<IInternalProps, IState> {
  public state = {
    indices: [] as IIndex[],
  }

  private dbRef: firebase.database.Reference

  constructor (props: IInternalProps) {
    super(props)
    const { databasePrefix, firebase: firebaseApp } = props
    this.dbRef = firebaseApp.database().ref(`${databasePrefix}/indices`)
  }

  public componentWillMount () {
    this.dbRef.on('value', snapshot => {
      if (snapshot != null) {
        const indices = snapshot.val() as IIndex[] | undefined
        if (indices != null) {
          this.setState({ indices })
        }
      }
    })
  }

  public render (): React.ReactNode {
    const { classes } = this.props
    const { indices } = this.state
    return (
      <div className={classes.board}>
        <Grid
          container={true}
          className={classnames(classes.root, classes.container)}
          spacing={16}
        >
          <Grid item={true}>
            <Grid
              container={true}
              direction='column'
              spacing={16}
            >
              {indices.map(index => (
                <Grid key={index.name} item={true}>
                  <Card className={classnames(
                    classes.card,
                    classes.noShadow,
                    classes.flexCenter
                  )}>
                    <CardContent>
                      <Typography variant='title' component='p'>
                        {index.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <DimensionArea definedClasses={classes} indices={indices} />
        </Grid>
      </div>
    )
  }
}

export default withFirebase<{}>(withStyles(styles)(App))
