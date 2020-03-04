import React from 'react'
import {db} from '../firebase'
import { fail } from 'assert'

function retrieveTeams(app){
            let Teams = []
            db.collection("teams").get().then(querySnapshot=>{
                querySnapshot.forEach(doc=>{
                    Teams.push(doc.data())
                })
              //  console.log(Teams)
                app.setState({
                    teams: Teams
                })
                
            })
}

function retrieveDQ(app){
    let DQ = []
    db.collection("DQ").get().then(querySnapshot=>{
        querySnapshot.forEach(doc=>{
            DQ.push(doc.data())
        })
        app.setState({
            DQ
        })
      //  console.log(app.state.DQ)
    })
}

function retrieveLeader(app){
        let Points = []
        let teamTotals = []
        let dq = app.state.DQ
       // console.log(dq)
         db.collection("points").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
               // console.log(doc.id, " => ", doc.data());
                Points.push(doc.data())
            });
            
            Points.forEach(team=> {
                let teamExists = false
                teamTotals.forEach(teamTotal=>{
                    if(team.team_num == teamTotal.team_num){
                        teamTotal.total += team.points
                        teamExists = true
                    }
                })
                dq.forEach(d=>{
                    if(d.member == team.member_num && d.team == team.team_num){
                        console.log("Matched dq")
                        teamExists = true
                    }
                })

                
                if(!teamExists){
                    teamTotals.push({team_num: team.team_num, total:team.points})
                }
                //console.log(teamTotals)
        })
        app.setState({
            points: Points,
            totals: teamTotals
        })   
        });
        
}

class Leaderboard extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            points: [],
            teams: [],
            DQ: [],
            styles: {
             margin: '0.25em 0 0.2em 0 !important',
             opacity: 1
            }
        }
        this._isMounted = false;
    }

    componentDidMount(){
        setInterval(()=>{
            if(this._isMounted){
               retrieveLeader(this) 
               retrieveDQ(this)
               let refreshing = true
               let opacity = 1
              // let oldStyles = this.state.styles
              
               let opacityReducer = setInterval(()=> 
               
               {this.setState({
                        styles: {
                            margin : '0.25em 0 0.2em 0 !important',
                            opacity
                        }
                    });
                    opacity -= 0.01
                   // oldStyles.opacity = opacity
                    if(opacity < 0.5) {
                        this.setState({
                            styles: {opacity: 1}
                        })
                        clearInterval(opacityReducer)
                    } 
                }, 10)
                
               
               
               //clearInterval(opacityReducer)
            }
            
        },15000)
        let app = this
        retrieveTeams(app)
        retrieveDQ(app)
        let dq = this.state.DQ
       // console.log(dq)
        let Teams = []
        let teamTotals = []
        
         db.collection("points").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                Teams.push(doc.data())
            });
            
            Teams.forEach(team=> {
            let teamExists = false
            let activitiesDone = 0
            teamTotals.forEach(teamTotal=>{
                if(team.team_num == teamTotal.team_num){
                    /* dq.forEach(d=>{
                        if(d.team == team.team_num && d.member == team.member_num){
                            
                        }
                    }) */
                    activitiesDone += 1
                    teamTotal.total += team.points
                    teamExists = true
                }
               
            })
            dq.forEach(d=>{
                if(d.member == team.member_num && d.team == team.team_num){
                    console.log("Matched dq")
                 //   teamExists = true
                }
            })
            if(!teamExists){
                teamTotals.push({team_num: team.team_num, total:team.points})
            }
        })
        //console.log("Printing team details")
        //console.log(teamTotals)
        //console.log(Teams)
        app.setState({
            points: Teams,
            totals: teamTotals
        })   
        });
        this._isMounted = true
        
    }

    

    componentWillUnmount(){
        this._isMounted = false
    }

    render(){
        let leaders;
        let details
       // console.log(this.state.teams)
            
        
        
        if(this.state.totals != undefined && this.state.teams != undefined){
            let sortedTotals = this.state.totals.sort((a,b)=>{
               return a.total > b.total ? -1 : 1;
            })
           // console.log(sortedTotals)
           let leaderCount = 0
           let not_leaders =  []
            leaders = sortedTotals.map(total=>{
                leaderCount += 1
                let holder;
                let hasName = false
                let notLeader = false
                this.state.teams.forEach(team => {
                    if(leaderCount <11){
                        if(team.number == total.team_num){
                            holder = <tr className="table-item " style={this.state.styles} key={total.team_num}><td>{leaderCount}</td><td className="has-background-grey-dark has-text-grey-lighter has-text-weight-medium" style={{textAlign: 'center'}}>{team.name}</td><td style={{textAlign: 'right'}}>{total.total.toFixed(2)}</td></tr>
                           // console.log(team)
                            hasName = true
                        }
                        if(!hasName){
                            holder = <tr className="table-item" style={this.state.styles} key={total.team_num}><td>{leaderCount}</td><td className="has-background-grey-dark has-text-grey-lighter has-text-weight-medium" style={{textAlign: 'center'}}>Team No {total.team_num}</td><td style={{textAlign: 'right'}}>{total.total.toFixed(2)}</td></tr>
                            
                        }
                    }else{
                        notLeader = true
                    }
                })
                if(notLeader){
                    not_leaders.push(total)
                }
                return holder;  
            });
            
            
            //console.log(not_leaders)
            details = not_leaders.map(failure=>{
                let holder;
                let hasName = false
                this.state.teams.forEach(team => {
                    
                        if(team.number == failure.team_num){
                            holder = (<div style={this.state.styles}  key={failure.team_num}  className="detail valign-wrapper card col l3.5">
                                       {team.name} - {failure.total.toFixed(2)}
                                    </div>)
                           // console.log(team)
                            hasName = true
                        }
                        if(!hasName){
                            holder = <div style={this.state.styles}  className="detail valign-wrapper card col l3.5" key={failure.team_num}>Team No. {failure.team_num} - {failure.total.toFixed(2)}</div>
                        }
                   
                })
                return holder
            })
        }
        
        
        
        /*let leader = teamTotals.map(total=> (
            {total}
        )) */

        return (
            <div className="container wide leaderboard">
                <div className='row'>
                    <div className="col center-align l12">
                    <table className="table center-align blue">
                        <tbody className="has-text-weight-bold is-size-5">
                        {leaders}
                        </tbody>
                    </table>
                    </div>
                <div className=" center-align col l12">
                    <div className="container">
                    <div className="row center-align">
                    {details}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default Leaderboard;