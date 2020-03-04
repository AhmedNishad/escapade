import React from 'react'
import Timer from './timer'
import {db} from '../firebase'

class PointsHandler extends React.Component{
    constructor(props){
        super(props)
        this.state={
            points: 50,
            seconds: 0,
            maxTime: 10,
            rate: 0.1,
            maxPoints: 50,
            DQcount: 0
        }
        this.updateTimePoints.bind(this)
    }

    componentDidMount(){
        this.setState({
            points: this.props.current.max_points,
            maxPoints: this.props.current.max_points,
            maxTime: this.props.current.max_time || 5,
            rate: this.props.current.rate
        })
       //console.log( this.state)
    }

    updateSeconds(secs){
        //console.log(secs)
            this.setState({
                seconds: parseFloat(secs.toFixed(1))
            })
        this.updateTimePoints(parseFloat(secs.toFixed(1)))
    }

    zeroPoints(e){
        e.preventDefault()
        this.setState({
            points: 0
        })
        this.props.zero_points
    }

    disqualify(e){
        e.preventDefault()
        let counter = this.state.DQcount
        counter ++;
        
        if(counter == 2){
            db.collection("DQ").add({
                team: this.props.current.team,
                member: this.props.member
            }).then((ref)=>{
                counter++
            }).catch(err=>{
                console.log(err)
            })
        }
        this.setState({
            DQcount: counter
        })
    }

    updateTimePoints(secs){
        let state = this.state;
        /* console.log(secs + state.maxPoints)
        console.log(state) */
        function calculate(seconds, max){
             let left;
            /*if(seconds < max){
                left = ((max-seconds)/max)*50
                console.log(max + ' ' + seconds)
            }else{
                left = 0
            } */
            if(seconds < max){
                left = state.points
            }else{
                if(state.points > 0.5)
                left = state.points - state.rate
            }
            return parseFloat(left.toFixed(2));
        }
        let points = calculate(secs, state.maxTime)
        this.props.time(points)
        this.setState({
            points: points
        })
    }

    updateSliderPoints(e){
        this.setState({
            points: parseInt(e.target.value,10)
        })

       // console.log(this.state.points)
    }

    resetSecs(){
        this.setState({
            seconds: 0
        })
    }

    resetPoints(){
        this.setState({
            points: this.state.maxPoints
        })
    }

    addPoints(e){
        e.preventDefault();
        e.target.innerText = "Resubmit"
        e.target.classList.add("disabled")
        this.props.time(this.state.points)
        this.props.submit(e, this.props.member)
    }

    render(){
       // console.log(this.props.current)
        return (
            <div>
            {this.props.added == this.props.member && (
                            <h4 className="green-text">Points added for Member No. {this.props.member}</h4>
                        )}
            { this.props.current.type==3 &&(
                    <div>
                     <h4>Unimplimented</h4>   
                    </div>   
                )
            }
            { this.props.current.type==2 &&(
                    <div>
                      <h4 className="center">{this.props.member}</h4>
                      <button onClick={this.disqualify.bind(this)} className="btn right red">Disqualify</button>
                      <input type='number' disabled  value={this.state.points} />
                      <div className="slidecontainer">
                        <input onChange={this.updateSliderPoints.bind(this)} defaultValue={this.state.points} className="slider" type="range" id="test5" min="0" max={this.state.maxPoints} />
                        <button className='center waves-effect waves-light btn' onClick={this.addPoints.bind(this)}>Add</button>
                     </div>
                    </div>   
                )
            }
            {this.state.DQcount == 1 && (<div className="warning-dq"><h4 >Click Disqualify once more to confirm </h4></div>)}
            {this.state.DQcount > 1  && (<div className="warning-dq"><h4 className="grey-text">Disqualified! </h4></div>)}
            { this.props.current.type==1 &&(
                    <div>
                        
                      <h4 className="center">{this.props.member}</h4>
                      
                      <button onClick={this.disqualify.bind(this)} className="btn right red">Disqualify</button>
                      <button onClick={this.zeroPoints.bind(this)} className="btn right black">Zero</button>
                      <input type='number' disabled value={this.state.points} />
                      <Timer className="left" resetPoints={this.resetPoints.bind(this)} resetTime={this.resetSecs.bind(this)} seconds={this.state.seconds} updateTime={this.updateSeconds.bind(this)} />
                      <button className='center waves-effect waves-light btn' onClick={this.addPoints.bind(this)}>Add</button>
                      <hr />
                    </div>   
                )
            }
            
            </div>   
        )
    }
    
}

export default PointsHandler;