import React,{ Component} from 'react';

import './index.css'

const axios = require('axios')

const api = 'http://localhost:3000/tools'

const initialState = {
    tools:{
        title: "",
        link: "",
        description:"",
        tags: []
    },
    finders:{
        name:"",
        tag:""
    },
    isActive:false,
    list: [],
    find:[],
    tags:[]
}

class Content extends Component{

    state = { ...initialState }

    componentDidMount() {
        axios.get(api).then(resp => {
            this.setState({ list: resp.data })
        })
    }
    handleSubmit(){
        const tools = this.state.tools
       
        axios.post(api, tools)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ tools: initialState.tools, list })
            })
    }
    handleSearch(){
        const finders = this.state.finders.name
        const check = document.getElementById('find')
        
        if(check.checked ==! null){
            axios.get(`${api}?tags_like=${finders}`)
            .then(resp => {
                
                this.setState({tags: resp.data })
                this.setState({isActive: true})
                
            })
        }else{
            axios.get(`${api}?q=${finders}`)
            .then(resp => {
                this.setState({ find: resp.data })
                this.setState({isActive: true})
            })
        }
    }
    getUpdatedList(tools, add = true) {
        const list = this.state.list.filter(u => u.id !== tools.id)
        if(add) list.unshift(tools)
        return list
    }

    updateField(event) {
        const tools = { ...this.state.tools }
        tools[event.target.name] = event.target.value
        this.setState({ tools })
    }

    updateFinder(event) {
        const finders = { ...this.state.finders }
        finders[event.target.name] = event.target.value
        this.setState({ finders })
    }

    remove(tools){
        axios.delete(`${api}/${tools.id}`).then(resp => {
        const list = this.getUpdatedList(tools, false)
        this.setState({ list })
        })
    }
    render(){
        return(
            <div className="content">
                <div className="search-add">
                    <div className="search">

                        <input 
                        type="search"
                        className="search-input"
                        name="name" 
                        value={this.state.finders.name}
                        onChange={e => this.updateFinder(e)} 
                        id=""
                        placeholder="&#xF002;  Search"/>

                        <button id="btn" onClick={()=>this.handleSearch()}>
                        <i className="fa fa-search"></i>
                        </button>

                        <input 
                        className="finder"
                        type="checkbox" 
                        id="find"/>
                        <label className="txt">Find by Tag</label>
                    </div>
                    <div className="add">
                        <button data-toggle="modal" data-target="#addProducts">
                        <i className="fa fa-plus"></i> Add
                        </button>
                    </div>
                </div>
                <br/>
                <br/>

                <div className="group-tools" >
                    {
                    this.state.isActive ? this.renderSearch(): this.renderTools() 
                    }
                </div>

                <div className="modal fade" id="addProducts" tabindex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">

                                <h5 className="modal-title" id="exampleModalLabel">
                                    <i className="fa fa-plus"></i> Add new tool
                                </h5>

                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>

                            </div>
                            <div className="modal-body">
                                <div className="add-tools">
                                    <form className="send-adds">
                                        <label htmlFor="name">Tool Name</label>
                                        
                                        <input 
                                        type="text"
                                        value={this.state.tools.title}
                                        onChange={e => this.updateField(e)} 
                                        name="title" 
                                        id="name"/>
                                        
                                        <br/>
                                        
                                        <label htmlFor="link">Tool Link</label>

                                        <input 
                                        type="text" 
                                        value={this.state.tools.link}
                                        onChange={e => this.updateField(e)} 
                                        name="link" 
                                        id="link"/>
                                        
                                        <br/>
                                        
                                        <label htmlFor="description">Tool Description</label>

                                        <textarea
                                        value={this.state.tools.description}
                                        onChange={e => this.updateField(e)}  
                                        name="description" 
                                        id="description" 
                                        rows="3">

                                        </textarea>
                                        
                                        <br/>
                                        
                                        <label htmlFor="tag">Tool Tags</label>

                                        <input
                                        value={this.state.tools.tags} 
                                        onChange={e => this.updateField(e)} 
                                        type="text" 
                                        name="tags" 
                                        id="tag"/>
                                        <br/><br/>
                                        <div className="modal-footer">
                                            <button onClick={()=>{this.handleSubmit()}} >Save changes</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }

    renderTools(){
        return this.state.list.map(tools => {
            return(
                <div className="tools" key={tools.id}>
                    <div className="capsule">
                        <div className="title">
                            <a href={tools.link} target="blank">{tools.title}</a>
                        </div>
                        <div className="add">
                            <button onClick={()=> this.remove(tools)}>
                            <i className="fa fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                    <div className="description">
                        {tools.description}
                    </div>
                    <br/>
                    <div className="tags">
                        {` ${tools.tags} .`}
                    </div>
                </div>
            )}
        )
    }
    renderSomeone(){

       
    }
    renderSearch(){
        return this.state.find.map(finders => {
            return(
                <div className="tools" key={finders.id}>
                    <div className="capsule">
                        <div className="title">
                            <a href={finders.link} target="blank">{finders.title}</a>
                        </div>
                        <div className="add">
                            <button onClick={()=> this.remove(finders)}>
                            <i className="fa fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                    <div className="description">
                        {finders.description}
                    </div>
                    <br/>
                    <div className="tags">
                        {`${finders.tags}.`}
                    </div>
                </div>
            )}
        )
    }

}

export default Content;