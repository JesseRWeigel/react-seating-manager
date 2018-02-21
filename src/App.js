import React, { Component } from 'react'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import withRoot from './withRoot'
import Button from 'material-ui/Button'

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
  chartContainer: {
    width: '100%',
    backgroundColor: 'blue'
  },
  row: {
    backgroundColor: 'purple',
    width: '70%',
    margin: '0 auto'

  },
  seat: {
    height: '20px',
    width: '20px',
    color: '#fff',
    backgroundColor: 'green',
    float: 'left'
  }
})

class App extends Component {
  state = {
    seatingChart: [],
    showChart: false,
  }

  makeSeatingChart = (rows, seatsPerRow) => {
    // Create two dimensional array to represent seating
    let seatingChart = new Array(rows)
    for (let i = 0; i < rows; i++) {
      seatingChart[i] = new Array(seatsPerRow)
      for (let j = 0; j < seatsPerRow; j++) {
        seatingChart[i][j] = 0
      }
    }
    this.setState({ seatingChart })
  }

  handleClick = () => {
    this.makeSeatingChart(5, 5)
    this.setState({
      showChart: true,
    })
  }
  render() {
    const { classes } = this.props
    const { seatingChart,
    showChart } = this.state
    return (
      <div className={classes.root}>
        <Typography variant="display1" gutterBottom>
          React Seating Manager
        </Typography>

        <Button variant="raised" color="secondary" onClick={this.handleClick}>
          Create Seating Chart
        </Button>
        {showChart &&
          seatingChart.length > 0 && (
            <div className={classes.chartContainer}>{seatingChart.map((row, index) =>
              <div className={classes.row} key={'r' + index}>
              {row.map((seat, seatNum) => 
              <div className={classes.seat} key={'s' + seatNum}>
              {seat}
              </div>
              )}
              </div>
            )

            }</div>
          )}
      </div>
    )
  }
}

export default withRoot(withStyles(styles)(App))
