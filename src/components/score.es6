import React from 'react'
// import ReactDOM from 'react-dom'
import { animate } from '../commons/utils'

import ConicGradient from '../vendor/conicGradient'

const PI = Math.PI
let context = ''

let Score = React.createClass({
    getInitialState: function () {
        let data = this.props.data

        data.score = this.props.data.score || 0
        data.label = this.props.data.label || 'XXX'
        data.oldScore = 0
        data.innerWidth = this.props.data.innerWidth || 6
        data.outWidth = this.props.data.outWidth || 10
        data.scoreFont = this.props.data.scoreFont || '32px sans-serif'
        data.labelFont = this.props.data.labelFont || '24px sans-serif'
        data.labelColor = this.props.data.labelColor || '#333'
        data.bgStockStyle = this.props.data.bgStockStyle || '#dbdaf1'
        data.stockStyle = this.props.data.stockStyle || '#99f'
        data.fillColor = this.props.data.fillColor || '#fff'

        return {
            data: data
        }
    },

    componentDidMount: function () {
        // console.log(this.refs.myCanvas.getContext('2d'))
        context = this.refs.myCanvas.getContext('2d')
        this.animate()
    },

    // 画图动作
    animate: function () {
        animate({
            delay: 1000 / 60,
            duration: 1000,
            // percentage: percentage,
            delta: progress => progress,
            step: ease => {
                this.drawDelta(ease)
            }
        })
    },

    drawDelta: function (ease) {
        context.clearRect(0, 0, this.state.data.width, this.state.data.height)
        // 画背景
        this.drawBg()

        // 画渐变
        this.drawGradua(ease)

        // 画与背景色一致的遮罩，将圆环内的渐变层覆盖
        this.drawCover()

        // 画分数
        this.drawScore()

        // 画类型
        this.drawTxt()
    },

    drawBg: function () {
        const startArc = 0.75 * PI
        const endArc = 0.25 * PI
        const color = this.state.data.bgStockStyle
        const lineWidth = this.state.data.innerWidth

        this.drawLineArc(startArc, endArc, color, lineWidth)
    },

    drawLineArc: function (startArc, endArc, color, lineWidth) {
        const imd = context.getImageData(0, 0, this.state.data.width, this.state.data.height)
        context.putImageData(imd, 0, 0)
        context.save()
        context.beginPath()
        context.strokeStyle = color
        context.arc(this.state.data.width / 2, this.state.data.height / 2, this.state.data.width * 0.5 * 0.8, startArc, endArc, false)
        context.lineWidth = lineWidth
        context.lineCap = 'round'
        // startArc_g = endArc
        context.stroke()

        context.restore()
    },

    drawGradua: function (ease) {
        let startColor = ''
        let endColor = ''
        const score = this.state.data.score * ease
        const startArc = 0.75 * PI
        const endArc = (0.75 * Math.PI) + (1.5 * Math.PI * this.state.data.oldScore / 100) + (1.5 * Math.PI * (this.state.data.score - this.state.data.oldScore) / 100 * ease)

        context.save()
        if (score <= 0) {
            return false
        }

        if (score < 60 && score > 0) {
            startColor = [255, 97, 148]
            endColor = [254, 166, 124]
        }

        if (score >= 60 && score < 80) {
            startColor = [105, 137, 255]
            endColor = [68, 238, 236]
        }

        if (score >= 80 && score <= 100) {
            startColor = [14, 207, 175]
            endColor = [68, 238, 236]
        }

        if (score >= 2) {
            // 画圆弧1
            const starArc1 = startArc - (1 / 90 * PI)
            const endArc1 = startArc + (1 / 90 * PI)
            const color1 = `rgb(${startColor})`
            const lineWidth1 = this.state.data.outWidth
            this.drawLineArc(starArc1, endArc1, color1, lineWidth1)

            // 圆弧2
            const starArc2 = endArc - (1 / 90 * PI)
            const endArc2 = endArc + (1 / 90 * PI)
            const color2 = `rgb(${endColor})`
            const lineWidth2 = this.state.data.outWidth
            this.drawLineArc(starArc2, endArc2, color2, lineWidth2)
        }

        // 渐变
        new ConicGradient()
          .addColorStop(0, startColor)
          .addColorStop(1, endColor)
          .fill(context,
              this.state.data.width / 2,
              this.state.data.width / 2,
              (this.state.data.width / 2 * 0.8) + (this.state.data.outWidth / 2),
              startArc,
              endArc,
              false)

        if (ease >= 1) {
            this.state.data.oldScore = score
        }

        return context.restore()
    },

    drawCover: function () {
        context.save()
        context.beginPath()
        context.arc(this.state.data.width / 2, this.state.data.width / 2, (this.state.data.width / 2 * 0.8) - (this.state.data.outWidth / 2), 0, Math.PI * 2, false)
        context.fillStyle = this.state.data.fillColor
        context.fill()
        context.restore()
    },

    drawScore: function () {
        context.save()
        context.fillStyle = this.state.data.labelColor
        context.textBaseline = 'middle'
        context.textAlign = 'center'
        context.font = this.state.data.scoreFont
        context.fillText(this.state.data.score, this.state.data.width / 2, this.state.data.height / 2)
    },

    drawTxt: function () {
        context.save()
        context.fillStyle = this.state.data.labelColor
        context.textBaseline = 'bottom'
        context.textAlign = 'center'
        context.font = this.state.data.labelFont
        context.fillText(this.state.data.label, this.state.data.width / 2, this.state.data.height - this.state.data.outWidth)
    },

    render: function () {
        console.log(this.state.data)
        return (
            <canvas className="score" ref="myCanvas">
            </canvas>
        )
    }
})

module.exports = Score
