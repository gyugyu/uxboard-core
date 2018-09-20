import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import classnames from 'classnames'
import * as firebase from 'firebase'
import * as React from 'react'
import { ContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'
import AddDimensionButton from './AddDimensionButton'
import DimensionArea from './DimensionArea'
import { IIndex } from './interfaces'

const styles: Record<string, CSSProperties> = {
  board: {
    overflowX: 'scroll',
    overflowY: 'hidden'
  },
  card: {
    width: 240,
    height: 120,
    overflowX: 'hidden',
    overflowY: 'scroll'
  },
  container: {
    flexWrap: 'nowrap'
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
    flexGrow: 1,
    width: '120%'
  }
}

interface InternalProps extends ContextOption {
  classes: Record<string, string>
}

type State = {
  indices: IIndex[]
}

class App extends React.Component<InternalProps, State> {
  private dbRef: firebase.database.Reference

  state = {
    indices: [] as IIndex[],
  }

  constructor (props: InternalProps) {
    super(props)
    const { databasePrefix, firebase } = props
    this.dbRef = firebase.database().ref(`${databasePrefix}/indices`)
  }

  componentWillMount () {
    this.dbRef.on('value', snapshot => {
      if (snapshot != null) {
        const indices = snapshot.val() as IIndex[] | undefined
        if (indices != null) {
          this.setState({ indices })
        }
      }
    })
  }

  render () {
    const { classes } = this.props
    const { indices } = this.state
    return (
      <React.Fragment>
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
        <AddDimensionButton />
      </React.Fragment>
    );
  }
}

export default withFirebase<{}>(withStyles(styles)(App))
