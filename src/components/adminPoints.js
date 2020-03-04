import React from 'react'
import {db} from '../firebase'
function generatePointId(t, m ,a){
    return t.toString() + a + m.toString()
}
class AdminPoints extends React.Component{


    
    constructor(props){
        super(props)
        this.state = {
            points: 0,
            member: 0,
            team: 0,
            time:0,
            id: 0,
            op: "Tarzan Course",
            operations: []
        }
    }

    componentDidMount(){
       // if(this._isMounted)
        //{
            let ops = []
            db.collection("activities").get()
            .then(qs => {
                qs.forEach(doc=>{
                    ops.push(doc.data())
                })
                this.setState({
                    operations : ops
                })
            })
       // }
    }

    updateOp(e){
        this.setState({
            op: e.target.value
        })
    }

    updatePoints(e){
        this.setState({
            points: parseInt(e.target.value,10)
        })
    }
    
    updateTime(e){
        this.setState({
            time: parseInt(e.target.value)
        })
    }

    updateMember(e){
        this.setState({
            member: parseInt(e.target.value)
        })
    }

    updateTeam(e){
        this.setState({
            team: parseInt(e.target.value)
        })
    }

    handlePoints(pointsHere){
        let {member, team, op} = this.state
        console.log(pointsHere)
        let id = generatePointId(team, member,op)
        console.log(id)
        db.collection("points").doc(id).set({
            activity: op,
            points : pointsHere,
            member_num: member,
            team_num: team,
            dateAdded: Date.now()
        })
        .then(
            this.setState({
                added: true,
                id,
                points: 0
            })
        )
    }

    handleRange(e){
        e.preventDefault()
        let pointsEntered = parseInt(e.target.parentElement.children[0].value)
        console.log(e.target.parentElement.children)
        this.setState({
            points: pointsEntered
        })
        this.handlePoints(pointsEntered)
    }

    handleTime(e){
        e.preventDefault()
        let time = parseInt(this.state.time, 10)
        let operation
        this.state.operations.forEach(op =>{
            if(op.activity = this.state.op){
                operation = op
                console.log("Found op")
            }
        })
        
        function calcPointsFromTime(time, operation){
            console.log(operation)
            console.log(time)
            let maxTime = parseInt(operation.max_time,10) || 50
            let rate = parseInt(operation.rate, 10) || 0.1
            let op_points = parseInt(operation.max_points, 10) || 100
            if(time < maxTime){
                return op_points
            }else{
                op_points -= (time - maxTime)*rate*10
            }
            console.log("Points: " + op_points)
            if(op_points > 0){
                return op_points

            }else{
                return 0.5
            }
        }
        let points = calcPointsFromTime(time, operation)
        console.log("points calculated as " + points)
        this.setState({
            time: 0, 
            points : points,
            op: operation.name
        })
        this.handlePoints(points)
    }

    /* componentDidMount(){
        this._isMounted = true;
    } */

    render(){

        return(
            <div>
                    {this.state.added && (
                                <h5 className="green-text">Points {this.state.id} Added</h5>
                        )}


                <div className="row">
                

                    <select onChange={this.updateOp.bind(this)} value={this.state.op}>
                        <option value="Tarzan Course">Tarzan Course</option>
                        <option value="Archery">Archery</option>
                        <option value="Balancing Beams">Balancing beam</option>
                        <option value="High Rope">High Rope</option>
                        <option value="Leopard Crawl">Leopard Crawl</option>
                        <option value="Low Rope">Low Rope</option>
                        <option value="Rifle Shooting">Rifle Shooting</option>
                        <option value="Sky Ladder">Sky Ladder</option>
                        <option value="Tire Wall">Tire Wall</option>
                        <option value="Tube Rafting">Tube Rafting</option>
                    </select>
                    <div className="input-field col s6">
                        <input onChange={this.updateMember.bind(this)} min="1" max="4" value={this.state.member} id="member_no" type="number" className="validate" />
                        <label className="active" htmlFor="team_name">Member No.</label>
                    </div>
                    <div className="input-field col s6">
                        <input onChange={this.updateTeam.bind(this)} value={this.state.team} min="1" max="40" id="team_no" type="number" className="validate" />
                        <label className="active" htmlFor="team_no">Team Number</label>
                    </div>
                    <div className="input-field col s6">
                        <label className="active" htmlFor="team_name">Time (s)</label>
                        <input onChange={this.updateTime.bind(this)} name="time" value={this.state.time} id="member_no" type="number" className="validate" />
                        <button className='center waves-effect green waves-light btn' onClick={this.handleTime.bind(this)}>Add Time</button>
                    </div>
                    <div className="input-field col s6">
                        <input onChange={this.updatePoints.bind(this)} name="points" value={this.state.points} id="member_no" type="number" className="validate" />
                        <label className="active" htmlFor="team_name">Points</label>
                        <button className='center waves-effect green waves-light btn' onClick={this.handleRange.bind(this)}>Add Points</button>
                    </div>

                   
                </div>
                
            </div>
        )
    }
}

export default AdminPoints