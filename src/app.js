import React from 'react'
import {HashRouter as Router, Route, Link} from 'react-router-dom'

import Activities from './components/activities'
import Leaderboard from './components/leaderboard'
import Points from './components/points'
import AddTeam from './components/addTeam'
import Admin from './components/admin'
import AdminPoints from './components/adminPoints'

class App extends React.Component{
    constructor(props){
        super(props)
    }
    
    render(){
//        <li><Link to='/activities'>Activities</Link> </li>
//        <li><Link to='/activities'>Activities</Link> </li>
                /* <nav >
                <div className='nav-wrapper' >
                <a href="#" data-target="mobile-demo" className="sidenav-trigger hide-on-med-and-up"><i className="material-icons">menu</i></a>
                    <ul id='nav-mobile' className="left hide-on-small-and-down">
                        <li><Link to='/leaderboard'>Leaderboard</Link> </li>
                        <li><Link to='/points'>Points management</Link> </li>
                        <li><Link to='/teams'>Teams management</Link> </li>
                    </ul>
                     hide-on-med-and-up
                     sidenav-trigger
                </div>
                </nav> */
        return (
            
            <Router >
                
                <nav>
                <div className='nav-wrapper green' >
                <a href="#" data-target="mobile-demo" className="sidenav-trigger "><i className="material-icons">menu</i></a>
                <ul id='mobile-demo' className='sidenav'>
                        <li><Link to='/leaderboard'>Leaderboard</Link> </li>
                        <li><Link to='/points'>Points</Link> </li>
                        <li><Link to='/teams'>Teams</Link> </li>
                    </ul>
                </div>
                </nav>
                <Route exact path='/' render={()=> (<div className="imageSection"></div>) } />
                <Route path='/activities' component={Activities} />
                <Route path='/leaderboard' component={Leaderboard}/>
                <Route path='/points' component={Points}/>
                <Route path='/teams' component={AddTeam}/>
                <Route path='/admin' component={Admin} />
                <Route path='/admin_p' component={AdminPoints}/>
            </Router>
        )
    }
}

export default App; 