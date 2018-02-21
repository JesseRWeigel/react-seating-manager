import React from 'react'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  seat: {
    color: '#fff',
    backgroundColor: 'green',
    padding: '8px',
    margin: '4px',
    cursor: 'pointer'
  },
  seatText: {
    display: 'block',
  },
})

class Seat extends React.Component {
  componentDidMount() {
    this.setState({ reserved: this.props.reserved })
  }

  clickHandler = (row, col) => {
    if (this.props.reserved) {
      this.props.cancel(row, col)
    } else {
      this.props.reserve(row, col)
    }
  }

  render() {
    const { classes, row, col, reserved } = this.props

    return (
      <div
        className={classes.seat}
        key={'s' + col + row}
        style={{ backgroundColor: `${reserved ? 'red' : 'green'}` }}
        onClick={() => this.clickHandler(row,col)}
      >
        <span className={classes.seatText}>{`R${row + 1}`}</span>
        <span className={classes.seatText}>{`C${col + 1}`}</span>
      </div>
    )
  }
}

export default withStyles(styles)(Seat)
