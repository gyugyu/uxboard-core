import Grid from '@material-ui/core/Grid'
import * as firebase from 'firebase'
import * as React from 'react'
import { DragDropContext } from 'react-dnd'
import Html5Backend from 'react-dnd-html5-backend'
import { IContextOption } from '../firebase/FirebaseContext'
import withFirebase from '../firebase/withFirebase'
import DndDimensionCards from './DndDimensionCards'
import { IDimension, IIndex } from './interfaces'

interface IProps {
  definedClasses: Record<string, string>
  indices: IIndex[]
}

type InternalProps = IContextOption & IProps

interface IState {
  dimensions: Record<string, IDimension>
  order?: string[]
}

class DimensionArea extends React.Component<InternalProps, IState> {
  public state = {
    dimensions: {} as Record<string, IDimension>,
    order: undefined as string[] | undefined
  }

  private dimensionsRef: firebase.database.Reference
  private orderRef: firebase.database.Reference

  constructor (props: InternalProps) {
    super(props)
    const { databasePrefix, firebase: firebaseApp } = props
    this.dimensionsRef = firebaseApp.database().ref(`${databasePrefix}/dimensions`)
    this.orderRef = firebaseApp.database().ref(`${databasePrefix}/dimensionOrder`)
  }

  public componentWillMount () {
    this.dimensionsRef.on('value', snapshot => {
      if (snapshot != null) {
        const dimensions = snapshot.val() as Record<string, IDimension> | undefined
        if (dimensions != null) {
          this.setState({ dimensions, order: Object.keys(dimensions) })
        }
      }
    })
    this.orderRef.on('value', snapshot => {
      if (snapshot != null) {
        const order = snapshot.val() as string[] | undefined
        this.setState({ order })
      }
    })
  }

  public render (): React.ReactNode {
    const { definedClasses, indices } = this.props
    const { dimensions } = this.state
    const { order } = this
    return (
      <Grid item={true}>
        <Grid
          container={true}
          direction='column'
          spacing={16}
        >
          <Grid item={true}>
            <Grid
              className={definedClasses.container}
              container={true}
              spacing={16}
            >
              {order.map((key, i) => {
                return (
                  <DndDimensionCards
                    definedClasses={definedClasses}
                    dimension={dimensions[key]}
                    id={key}
                    index={i}
                    indices={indices}
                    key={key}
                    onDrop={this.handleDrop}
                    onHover={this.handleHover}
                  />
                )
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  private handleDrop = async (): Promise<void> => {
    await this.orderRef.set(this.order)
  }

  private handleHover = (dragIndex: number, hoverIndex: number) => {
    const order = this.order.slice()
    const removed = order.splice(dragIndex, 1)
    order.splice(hoverIndex, 0, removed[0])
    this.setState({ order })
  }

  private get order (): string[] {
    const { dimensions, order } = this.state
    return order || Object.keys(dimensions)
  }
}

export default DragDropContext(Html5Backend)(withFirebase<IProps>(DimensionArea))
