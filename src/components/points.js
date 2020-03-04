import React from 'react'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom'

import {db} from '../firebase'

// 1 : Timed 2 : Judged 3 : Deduct

import PointsHandler from './pointsHandler'

class Points extends React.Component{
    constructor(props){
        super(props)
        this.state={
            user: 'admin',
            password: '#escape',
            logged: false,
            pointsAdded: {toMember: 0},
            activities: [],
            current: {},
            phase: 0 // Phase 0 : Startup load list of all activities, 1 : Teams, 2: Points 
        }
    }

    handleAuth(e){
        e.preventDefault()
        let {user, password} = e.target.children
        if(user.value == this.state.user && password.value == this.state.password){
            this.setState({
                logged: true
            })
            console.log('login success')
            this.retrieveActivities()
        }
    }

    retrieveActivities(){
        db.collection("activities").get().then(querySnap=>{
            const data = querySnap.docs.map(doc=> doc.data())
         //   console.log(data)
            this.setState({
                activities: data
            })
        })
    }

    selectActivity(e){
        let currentActivity = this.state.current
        currentActivity.id = e.target.parentElement.getAttribute('data-id')
        currentActivity.activity = e.target.innerText
        currentActivity.type = e.target.parentElement.getAttribute('data-type')
        currentActivity.points = 50
        currentActivity.max_points = parseInt(e.target.parentElement.getAttribute('data-points-max'),10)
        currentActivity.max_time = parseInt(e.target.parentElement.getAttribute('data-time-max-deduct'),10)
        currentActivity.rate = parseFloat(e.target.parentElement.getAttribute('data-deduct-rate'))
        currentActivity.stages = JSON.parse(e.target.parentElement.getAttribute('data-stage'))
        console.log(currentActivity.stages)
       // console.log(parseFloat(e.target.parentElement.getAttribute('data-deduct-rate')))
        //console.log(e.target.innerText)
        this.setState ({
            current : currentActivity,
            phase: 1
        })
    }

    selectTeam(e){
        let currentActivity = this.state.current
        if(e.target.children[0] != undefined){
            currentActivity.team = e.target.children[0].innerText
        }else{
            currentActivity.team = e.target.textContent
        }
        
        //console.log(e.target.innerText)
        this.setState ({
            current : currentActivity,
            phase: 2
        })
    }

    /* selectMember(e){
        let currentActivity = this.state.current
        if(e.target.children[0] != undefined){
            currentActivity.member = e.target.children[0].innerText
        }else{
            currentActivity.member = e.target.innerText
        }
        
        console.log(e.target.innerText)
        this.setState ({
            current : currentActivity,
            phase: 3,
            pointsAdded: false
        })
    } */

    handleBack(){
        let phase = this.state.phase
        if(this.state.phase != 0){
            this.setState({
                phase: phase-1,
                pointsAdded: {toMember:0}
            })
        }
    }

    handlePoints(e, m){
        e.preventDefault()
        //console.log(this.state.current)
        let {team, points, activity, max_points} = this.state.current
        let maxPoints = max_points
        let member = m
        function generatePointId(t, m ,a){
            return t + a + m
        }
        db.collection('points').doc(generatePointId(team,member,activity)).set({
            team_num : team,
            member_num : member,
            points,
            activity,
            dateAdded: Date.now()
        }).then(()=>{
           // console.log('added')
            let curr = this.state.current
            let newPointsAdded = this.state.pointsAdded
            newPointsAdded.toMember = m;
            curr.points = maxPoints
            curr.member = m
            this.setState({
                current: curr,
                pointsAdded: newPointsAdded
            })
        }).catch(err=> console.log(err))
    }

    deductPoints(e){
        e.preventDefault()
       // console.log(e)
        let curr = this.state.current
        if(curr.points > 4){
            let newPoints = curr.points - 5
            curr.points = newPoints
            this.setState({
                current: curr
            })
        }
    }

    addPoints(e){
        e.preventDefault()
      //  console.log(e)
        let curr = this.state.current
        if(curr.points < 16){
            let newPoints = curr.points + 5
            curr.points = newPoints
            this.setState({
                current: curr
            })
        }
    }

    zeroPoints(){
        let curr = this.state.current
        curr.points = 0
        this.setState({
            current : curr
        })
    }

    timePoints(points){
        let curr = this.state.current
        
        curr.points = points
        this.setState({
            current: curr
        })
    }

    judgePoints(points){
        
        
        curr.points = points
        this.setState({
            current: curr
        })
    }

    render(){
        let cont=[];
        if(this.state.logged){
            let activities = this.state.activities
            //console.log(activities)
            cont = activities.map(act=>{
                //console.log(act)
               return (<div className='card  blue-grey darken-2' key={act.id}>
                   <div className='card-content white-text'>
                       <h1 data-id={act.id} className="hover-title" data-points-max={act.max_points || 50} data-time-max-deduct={act.max_time || 10} 
                       data-deduct-rate={act.rate || 0.1} data-stages={JSON.stringify(act.stages || [])} data-type={act.type} onClick={this.selectActivity.bind(this)}><span className='card-title '>{act.name} </span></h1>
                       <p>@ {act.area} conducted by {act.senior}</p>
                   </div>
               </div>)
            })
            
        }

        let teams = [];
        for(let i=1; i < 41; i++){
            teams[i] = i
        }
        let teamsElems = teams.map(i=> (<div className='data-item is-vertical' key={i} onClick={this.selectTeam.bind(this)}>
                <h3>{i}</h3>
            </div>))

        /* let members = []
        for(let i=1; i < 5; i++){
            members[i] = i
        }
        let memberElems = members.map(i=> (<div key={i} className='data-item' onClick={this.selectMember.bind(this)}>
                <h3>{i}</h3>
            </div>))  */ 
            
        let pointsHandlers = [1,2,3,4].map(i=>(
            
                <div>             
             <PointsHandler zero_points={this.zeroPoints.bind(this)} key={i} added={this.state.pointsAdded.toMember} submit={this.handlePoints.bind(this)} member={i} time={this.timePoints.bind(this)} add={this.addPoints.bind(this)} judge={this.judgePoints.bind(this)} deduct={this.deductPoints.bind(this)} current={this.state.current}/> <br />
            </div>
            )
        )

        
        

        return(
            <div>
                { this.state.phase!=0 && (<h3 onClick={this.handleBack.bind(this)}>Back</h3>)} <br/>
                {!this.state.logged && this.state.phase==0 &&(
                    <form onSubmit={this.handleAuth.bind(this)} >
                    User: <input type='text' name='user' required/> <br/>
                    Password: <input type='password' name='password' required/> <br/>
                    <input className="btn waves-effect center green gray-text text-darken-2 waves-light" type='submit' />
                </form> 
                )}
                {this.state.phase==0 && (
                    <ul>
                        {cont}
                    </ul>
                )}
                
                {this.state.phase == 1 && (
                    <div className='data-container'>
                        <h3 >Select Team Number</h3> <br />
                        
                        {teamsElems}
                    </div>
                )}
                
                {this.state.phase == 2 && (
                    <div>
                        <h4 className="blue-text">Team No . {this.state.current.team}</h4> 
                    <form className='pointsForm'>
                        <input type='number' name='member' hidden defaultValue="1" />

                        {pointsHandlers}
                        
                        {/* <PointsHandler added={this.state.pointsAdded.toMember} submit={this.handlePoints.bind(this)} member={2} time={this.timePoints.bind(this)} add={this.addPoints.bind(this)} judge={this.judgePoints.bind(this)} deduct={this.deductPoints.bind(this)} current={this.state.current}/> <br />
                        <PointsHandler added={this.state.pointsAdded.toMember} submit={this.handlePoints.bind(this)} member={3} time={this.timePoints.bind(this)} add={this.addPoints.bind(this)} judge={this.judgePoints.bind(this)} deduct={this.deductPoints.bind(this)} current={this.state.current}/> <br />
                        <PointsHandler added={this.state.pointsAdded.toMember} submit={this.handlePoints.bind(this)} member={4} time={this.timePoints.bind(this)} add={this.addPoints.bind(this)} judge={this.judgePoints.bind(this)} deduct={this.deductPoints.bind(this)} current={this.state.current}/> <br /> */}
                        
                    </form>
                    </div>
                )}
            </div>
            
        )
    }
}

export default Points;

/*{this.state.phase == 2 && (
                    <div className='data-container'>
                        
                        <h3 >Select Member Number</h3>
                        
                        {memberElems}
                    </div>
                )}*/