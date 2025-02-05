import React, { Component } from 'react'

class Example extends Component {
  static defaultProps = {
    initial: 'value',
    isReal: false,
    cars: [
      {
        name: 'Fox Turbo',
        model: 'FANCY286',
        year: 2017
      },
      {
        name: 'Not Fox',
        model: 'RIGIDbody',
        year: 'last year'
      }
    ]
  }
  handleSubmit = e => {
    e.preventDefault()
    alert`These colors are awesome, ${e.target.value}! 👍`
  }
  render() {
    return (
      <article className="exemplified">
        <h2>Here's your cars, sir!</h2>
        <pre>
          {this.props.cars}
        </pre>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="name">What's your name?</label>
          <input type="text" id="name" />
        </form>
      </article>
    )
  }
}
export default Example
