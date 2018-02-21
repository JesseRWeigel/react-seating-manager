import React, { Component } from 'react'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import withRoot from './withRoot'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
const distance = require('manhattan')

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
    flexGrow: 1,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  chartContainer: {
    width: '100%',
    backgroundColor: 'blue',
  },
  row: {
    backgroundColor: 'purple',
    width: '70%',
    height: '35px',
    margin: '0 auto',
  },
  seat: {
    height: '20px',
    width: '20px',
    color: '#fff',
    backgroundColor: 'green',
    float: 'left',
  },
})

class App extends Component {
  state = {
    seatingChart: [],
    showChart: false,
    rows: 0,
    seatsPerRow: 0,
    seat: 0,
    row: 0,
    seatNotAvailable: false,
    seatsNotAvailable: false,
    numOfSeats: 0,
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
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

  handleClick = (rows, seatsPerRow) => {
    this.makeSeatingChart(rows, seatsPerRow)
    this.setState({
      showChart: true,
    })
  }

  reserveSeat = (arr, row, column) => {
    this.setState({ seatNotAvailable: false })
    // Check to see if seat exists. Is seat open? Return true. Else, return false
    if (
      row > 0 && column > 0 &&
      arr.length > row &&
      arr[row].length > column &&
      arr[row][column] === 0
    ) {
      const newArr = arr
      newArr[row][column] = 1
      // seatsRemaining(newArr)
      this.setState({ seatingChart: newArr })
    } else {
      this.setState({ seatNotAvailable: true })
    }
  }

  reserveSeats = (arr, numOfSeats) => {
    this.setState({ seatsNotAvailable: false })
    // Find optimum seat (middle of row 1)
    const optimumSeat = [0, Math.floor(arr[0].length / 2)]

    let potentialSeatCombinations = []
    // Reject requests for more than 10 seats
    if (numOfSeats > 10) {
      console.log('Sorry, no more than 10 seats can be reserved at one time.')
    } else {
      // Find contiguous seats closest to optimum seat
      // Reject requests for more seats than one row can hold
      for (let i = 0; i < arr.length; i++) {
        let seatNumbers = []

        if (arr[i].length < numOfSeats) {
          console.log(
            'Sorry, the rows are not long enough to accomidate that request.'
          )
        } else if (arr[i].filter(item => item === 0).length < numOfSeats) {
          // Skip to next row if there are not enough available seats
          console.log('Not enough open seats in row ' + (i + 1))
        } else {
          // Reject requests if there are not that many contiguous seats available
          // loop over each row
          // make an array of all the contiguous seats that are open, if there are none return false
          // find manhattan distance of each of those seats
          // return the group of seats with that distance
          // Use the seatData scores to find sets of seats with the lowest score.
          for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === 1) {
              // Clear seatNumbers array if this seat is already reserved
              seatNumbers = []
            } else {
              // Save this seat to the seatNumbers array
              seatNumbers = [...seatNumbers, { row: i, column: j }]

              if (seatNumbers.length == numOfSeats) {
                //Add seats to array of potential seat combinations
                potentialSeatCombinations = [
                  ...potentialSeatCombinations,
                  seatNumbers,
                ]
              } else if (seatNumbers.length > numOfSeats) {
                const seatsToRemove = seatNumbers.length - numOfSeats
                // Remove seats from seatNumbers array
                seatNumbers.splice(0, 1)

                if (seatNumbers.length == numOfSeats) {
                  //Add seats to array of potential seat combinations
                  potentialSeatCombinations = [
                    ...potentialSeatCombinations,
                    seatNumbers,
                  ]
                }
              }
            }
          }
        }
      }
    }

    if (potentialSeatCombinations.length === 0) {
      this.setState({ seatsNotAvailable: true })
    } else {
      let manhattanTotalsArr = []
      potentialSeatCombinations.map(item => {
        let manhattanTotal = 0
        item.map(
          seat =>
            (manhattanTotal =
              manhattanTotal + distance(optimumSeat, [seat.row, seat.column]))
        )
        manhattanTotalsArr = [...manhattanTotalsArr, manhattanTotal]
      })

      const minArrVal = Math.min(...manhattanTotalsArr)
      const indexOfMinArrVal = manhattanTotalsArr.indexOf(minArrVal)
      const arrVal = potentialSeatCombinations[indexOfMinArrVal]

      arrVal.map(item =>
        this.reserveSeat(this.state.seatingChart, item.row, item.column)
      )
    }
  }

  render() {
    const { classes } = this.props
    const {
      seatingChart,
      showChart,
      rows,
      seatsPerRow,
      seat,
      row,
      seatNotAvailable,
      seatsNotAvailable,
      numOfSeats,
    } = this.state
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant="display2" gutterBottom>
              React Seating Manager
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="rows"
              label="Rows"
              value={rows}
              onChange={this.handleChange('rows')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="seats-per-row"
              label="Seats per Row"
              value={seatsPerRow}
              onChange={this.handleChange('seatsPerRow')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="raised"
              color="secondary"
              onClick={() => this.handleClick(rows, seatsPerRow)}
            >
              Create Seating Chart
            </Button>
          </Grid>
          <Grid item xs={12}>
            {showChart &&
              seatingChart.length > 0 && (
                <div className={classes.chartContainer}>
                  <Grid item xs={12}>
                    <Typography variant="display1" gutterBottom>
                      Reserve a Seat
                    </Typography>
                    {seatNotAvailable && (
                      <Typography variant="display2" gutterBottom>
                        Sorry, that seat is not available. Please select
                        another.
                      </Typography>
                    )}
                    <TextField
                      id="row"
                      label="Row"
                      value={row}
                      onChange={this.handleChange('row')}
                      type="number"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                    <TextField
                      id="seat"
                      label="Seat"
                      value={seat}
                      onChange={this.handleChange('seat')}
                      type="number"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="raised"
                      color="secondary"
                      onClick={() =>
                        this.reserveSeat(seatingChart, row - 1, seat - 1)
                      }
                    >
                      Reserve Seat
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="display1" gutterBottom>
                      Or enter the number of seats you would like to reserve
                    </Typography>
                    {seatsNotAvailable && (
                      <Typography variant="display2" gutterBottom>
                        Sorry, we can't fulfill that request. Please try
                        requesting two smaller sets of seats.
                      </Typography>
                    )}
                    <TextField
                      id="num-of-seats"
                      label="Number of Seats"
                      value={numOfSeats}
                      onChange={this.handleChange('numOfSeats')}
                      type="number"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="raised"
                      color="secondary"
                      onClick={() =>
                        this.reserveSeats(seatingChart, numOfSeats)
                      }
                    >
                      Reserve Seats
                    </Button>
                  </Grid>
                  {seatingChart.map((row, index) => (
                    <div className={classes.row} key={'r' + index}>
                      {row.map((seat, seatNum) => (
                        <div className={classes.seat} key={'s' + seatNum}>
                          {seat}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withRoot(withStyles(styles)(App))
