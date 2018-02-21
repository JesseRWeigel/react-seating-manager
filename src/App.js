import React, { Component } from 'react'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import withRoot from './withRoot'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'

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
    } = this.state
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant="display1" gutterBottom>
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
                    <Typography variant="display2" gutterBottom>
                      Reserve a Seat
                    </Typography>
                    {seatNotAvailable && (
                      <Typography variant="display2" gutterBottom>
                        Sorry, that seat is already taken. Please select
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
                      onClick={() => this.reserveSeat(seatingChart, row-1, seat-1)}
                    >
                      Reserve Seat
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
