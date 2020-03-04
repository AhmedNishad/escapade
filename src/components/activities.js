import React from 'react'

import {db} from '../firebase'

class Activities extends React.Component{
    constructor(props){
        super(props)
        this.state={
            added: false,
            type: 'Pick a type'
        }
    }

    addActivity(e){
        function generateActivityId(name){
            let arr = name.split(' ')
            let str = ''
            arr.forEach(i=> str+=i)
            str += Math.floor(Math.random()*1000)
            return str
        }
        e.preventDefault()
        //let {activity_name, area, senior, type, description} = e.target.children
        let activity = {}
        for(let i =0; i<e.target.children.length; i++){
            let child = e.target.children[i]
            
            if(child.getAttribute('class') && child.children[0] != undefined && child.children.length > 0 && child.children[1].getAttribute('for')!=undefined){
                console.log(child.children[0])
                console.log(child.children[0].value)
                console.log(child.children[1].getAttribute('for'))
                let key = child.children[1].getAttribute('for')
                let val = child.children[0].value
                if(val != undefined){
                    activity[key] = val
                }
                
            }
        }
        let id = generateActivityId(activity.name)
        activity.id = id
        /* let activity = {
            id,
            description: description.value,
            activity_name: activity_name.value,
            area: area.value,
            senior: senior.value,
            type: type.value
        } */
        
        db.collection("activities").doc(id).set(activity).then(()=>{
            console.log('successfully added')
            this.setState({
                added: true
            })
        }).catch(err=>{
            console.log(err)
        })
        e.target.reset()
        console.log(activity)
    }

    handleTypeChange(e){
        this.setState({
            type: e.target.value
        })
    }

    render(){
        return (
            <div className='row'>
                <div className='col s10'>
                <form onSubmit={this.addActivity.bind(this)}>
                
                    <h1>Add New Activity</h1>
                    {this.state.added && <span className='green-text text-flow'>Sucessfully added </span> } <br/>
                            <div className='input-field col s6'>
                                    <input type='text' id='name' name='activity_name' required/>
                                    <label htmlFor="name">Name</label>
                            </div>
                            <div className="input-field col s6">
                                    <textarea name='description' id="descr" className="materialize-textarea"></textarea>
                                    <label htmlFor="descr">Description</label>
                                </div> 
                            
                            <div className='input-field col s6'>
                                    <input type='text' id='area' name='area' required/>
                                    <label htmlFor="area">Area</label>
                            </div>

                            <div className='input-field col s6'>
                                    <input type='text' id='senior' name='senior' required/>
                                    <label htmlFor="senior">Senior</label>
                            </div>
                             
                           <div className="input-field col s12">
                                <select id='type' className='browser-default' required>
                                    <option value="" disabled >Scoring Method</option>
                                    <option value="1">Timed</option>
                                    <option value="2">Judged</option>
                                    <option value="3">Deducted</option>
                                </select>
                                <label htmlFor="type"></label>
                            </div>
                     
                        <input className="btn waves-effect waves-light" type='submit' />
                </form>
                </div>
            </div>
            
        )
    }
}

export default Activities;