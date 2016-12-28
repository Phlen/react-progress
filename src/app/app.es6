import '../sass/app.scss'
let data = {
    label: 'XXX',
    score: 60,
    width: 140,
    height: 140
}
setInterval(function () {
    var dist = Math.floor(Math.random() * 100)
    data.score = dist
    console.log(dist)
}, 2000)
import React from 'react'
import ReactDOM from 'react-dom'

import Score from '../components/score'

let CanvasBox = React.createClass({
    getInitialState: function () {
        return {
            data: data
        }
    },
    render: function () {
        return (
            <div className="canvas-box">
                <Score data={this.state.data} />
            </div>
        )
    }
})

ReactDOM.render(
    <CanvasBox />,
    document.getElementById('main')
)
