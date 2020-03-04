import React from 'react'
import {db} from '../firebase'
class Admin extends React.Component{
    constructor(props){
        super(props)
        this.state={
            removed: false,
            points: [],
            modifying: {
                is: false,
                team_num: 0,
                member_num: 0
            }
        }
        this._isMounted = false
    }

    componentWillUnmount(){
        this._isMounted = false
    }


    getPoints(){
        if(this._isMounted){
            this.setState({
                removed: false
            })
            let points = []
            db.collection("points").get().then(querySnap =>{
                let pointItems = []
                querySnap.forEach(doc=>{
                    let pointItem = doc.data();
                    if(pointItem.dateAdded == undefined){
                        pointItem.dateAdded = 1519129858900
                    }
                    pointItems.push(pointItem)
                    points.push(pointItem)
                })
                points.sort((a,b)=> b.dateAdded-a.dateAdded)
                this.setState({
                    points
                })
            })
        }
    }

    modify(e){
        e.preventDefault()
        let member = parseFloat(e.target.getAttribute('data-member'))
        let team = parseFloat(e.target.getAttribute('data-team'))
        this.setState({
            modifying: {
                is: true,
                member_num: member,
                team_num: team
            }
        })
    }

    modifyPoints(e){
        e.preventDefault()
        let points = parseFloat(e.target.newPoints.value)
        let id = e.target.getAttribute('data-id').toString()
        db.collection('points').doc(id).get().then(doc=>{
            let newPoints = doc.data()
            newPoints.points = points
            db.collection('points').doc(id).set(newPoints).then(()=>{
                this.setState({
                    modifying: {
                        is: false
                    }
                })
            })
        })
        
    }

    disregard(e){
        e.preventDefault()
        e.target.parentElement.parentElement.classList.add('orange', 'white-text')
        let id = e.target.getAttribute('data-id')
        db.collection("points").doc(id).delete().then(()=>{
            this.setState({
                removed: true
            })
        })
    }

    componentDidMount(){
        
        this.getPoints.bind(this)()
        setInterval(this.getPoints.bind(this), 10000);
        this._isMounted = true
    }

    render(){
        let pointsDetails
        function getId(member, team ,activity){
            return team + activity + member
        }
            let points = this.state.points
            pointsDetails = points.map(point=>{
                let dateAdded = new Date(point.dateAdded)
                let id = getId(point.member_num, point.team_num, point.activity)
                return (
                    <tr  key={id}>
                        <td>{dateAdded.getHours()} : {dateAdded.getMinutes()} : {dateAdded.getSeconds()}</td>
                        <td>{point.team_num}</td>
                        <td>{point.member_num}</td>
                        <td>{point.points}</td>
                        <td>{point.activity}</td>
                        <td>
                            <button data-id={id}  className="button red white-text" onClick={this.disregard.bind(this)}>Disregard</button>
                            <button data-member={point.member_num} data-team={point.team_num} className="button blue white-text" onClick={this.modify.bind(this)}>Modify</button>
                            {this.state.modifying.is && this.state.modifying.team_num == point.team_num && this.state.modifying.member_num == point.member_num &&(
                                <form data-id={id}  onSubmit={this.modifyPoints.bind(this)}>
                                    <input type='text' name='newPoints' />
                                    <button className="button green white-text">Change</button>
                                </form>
                            )}</td>
                    </tr>
                )
            })
        
        return (
            <div className="row">
               {this.state.removed && (
                                <h6 className="red white-text">Removed successfully</h6>
                            )}
                    
                <table className="table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Team</th>
                            <th><abbr title="Member">Mem</abbr></th>
                            <th><abbr title="Points Entered">Points</abbr></th>
                            <th><abbr title="Operation">Op</abbr></th>
                            <th><abbr title="Change">Actions</abbr></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pointsDetails}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Admin