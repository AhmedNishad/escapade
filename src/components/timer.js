import React from 'react'

class Timer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            running: false
        }
    }

    componentDidMount(){
        this.count()
    }

    count(){
        setInterval(
            ()=>{
                let secs = this.props.seconds
                if(this.state.running){
                    secs += 0.1
                    this.props.updateTime(secs)
        }
            },100
        )
        
    }

    start(e){
        e.preventDefault()
        this.setState({
            running:true
        })
    }

    reset(e){
        e.preventDefault()
        this.props.resetTime()
        this.props.resetPoints()
    }

    stop(e){
        e.preventDefault()
        this.setState({
            running:false
        })
    }

    render(){
        return(
            <div>
                {this.props.seconds.toFixed(1)}
                <button onClick={this.start.bind(this)} className='btn-floating btn-large waves-effect waves-light green'>Start</button>
                <button onClick={this.stop.bind(this)}  className='btn-floating btn-large waves-effect waves-light red'>Stop</button>
                
                <button onClick={this.reset.bind(this)}  className='btn-floating btn-large waves-effect waves-light blue'>Reset</button>
            </div>
        )
    }
}

export default Timer;