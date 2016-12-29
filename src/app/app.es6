import '../sass/app.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import Score from '../components/score'

let CanvasBox = React.createClass({
    getInitialState: function () {
        let data = {
            label: 'XXX',
            score: 60,
            width: 140,
            height: 140
        }
        return {
            data: data
        }
    },

    changeData: function () {
        let data = this.state.data
        data.score = Math.floor(Math.random() * 100)
        this.setState({
            data: data
        })
    },

    componentDidMount: function () {
        let intervalId = setInterval(this.changeData, 5000)
        this.setState({intervalId: intervalId})
    },

    componentWillUnmount: function () {
        // use intervalId from the state to clear the interval
        clearInterval(this.state.intervalId)
    },

    render: function () {
        return (
            <div className="canvas-box">
                <Score data={this.state.data}/>
            </div>
        )
    }
})

ReactDOM.render(
    <CanvasBox />,
    document.getElementById('main')
)
