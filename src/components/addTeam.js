import React from 'react'
import {db} from '../firebase'

class AddTeam extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name: "",
            number: 0,
            added: false
        }
    }

    updateName(e){
        this.setState({
            name: e.target.value
        })
    }

    updateNumber(e){
        this.setState({
            number: e.target.value
        })
    }

    addTeam(e){
        function generateTeamId(team){
            return team.number + team.name
        }
        e.preventDefault();
        let teamObject = {}
        teamObject.name = this.state.name
        teamObject.number = this.state.number
        db.collection("teams").doc(generateTeamId(teamObject)).set(teamObject)
        .then(()=>{
            this.setState({
                added: true
            })
        })
        console.log(teamObject)
    }

    render(){
     //   let pointsCompleted = []
        return(
            
            <div className="row">
                {this.state.added && (
                            <h5 className="green-text">Team {this.state.name} Added</h5>
                        )}
                <div className="input-field col s6">
                    <input onChange={this.updateName.bind(this)} value={this.state.name} id="team_name" type="text" className="validate" />
                    <label className="active" htmlFor="team_name">Team Name</label>
                </div>
                <div className="input-field col s6">
                    <input onChange={this.updateNumber.bind(this)} value={this.state.number} id="team_no" type="number" className="validate" />
                    <label className="active" htmlFor="team_no">Team Number</label>
                </div>
                <button className='center waves-effect green waves-light btn' onClick={this.addTeam.bind(this)}>Add</button>
            
                    
            </div>
        )
    }
}

export default AddTeam;