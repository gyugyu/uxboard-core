import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import firebase from 'firebase'
import React from 'react'
import { ContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'
import AddDimensionButton from './AddDimensionButton'
import DimensionArea from './DimensionArea'
import { IIndex } from './interfaces'

const styles: Record<string, CSSProperties> = {
  board: {
    overflowX: 'scroll',
  },
  card: {
    alignItems: 'center',
    display: 'flex',
    width: 300,
    height: 200,
    justifyContent: 'center'
  },
  card2: {
    width: 300,
    height: 200,
  },
  card3: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  container: {
    flexWrap: 'nowrap'
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
        const indices = snapshot.val() as IIndex[]
        this.setState({ indices })
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
            className={`${classes.root} ${classes.container}`}
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
                    <Card className={`${classes.card} ${classes.noShadow}`}>
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
            <DimensionArea classes={classes} indices={indices} />
          </Grid>
        </div>
        <AddDimensionButton />
      </React.Fragment>
    );
  }
}

export default withFirebase<{}>(withStyles(styles)(App))
