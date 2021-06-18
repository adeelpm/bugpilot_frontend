import React, { Component } from 'react'
import axios from 'axios'
import headers from '../util/headers';
import Cookies from 'universal-cookie';
import '../index.css'
// import img from '../25.gif'

import { Link } from 'react-router-dom';
import { Modal, Button, Form, Navbar } from 'react-bootstrap'
import { XGrid } from "@material-ui/x-grid";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';

// import Navbar from '../components/navbar'

const cookies = new Cookies()
const API_URL=process.env.REACT_APP_API_URL


export class ProjectScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            rw: [],
            projectId:"",
            projectName: "",
            projectDescription: "",
            createProjectModalShow: false,
            editProjectModalShow:false,
            searchuser:[],
            projectmembers:[]
        }
        this.getProject()
    }


    getProject = async () => {
        console.log('getting project')
        console.log(window.location.hostname)

        let uid = cookies.get('uid')

        const uri = `${API_URL}/api/project/${uid}`
        await axios.get(uri, headers).then(
            (res) => {
                console.log("resdata", res)
                let row=res.data.map((row)=>{
                    // console.log("list of project",row)
                    return({
                        id:row.id,
                        name:row.name,
                        description:row.description
                        
                    })
                })
                this.setState({ rw:row })
            }

        )


    }

    toggleModal() {
        console.log('calling modal')
        console.log(this.state.createProjectModalShow)
        this.setState({
            createProjectModalShow:!this.state.createProjectModalShow

        })
        console.log(this.state.createProjectModalShow)
        
    }
    toggleEditModal(){
        this.setState({
            editProjectModalShow:!this.state.editProjectModalShow
        })
    }


    cs = [
        { field: 'id', headerName: 'ID',  },
        { field: 'name', headerName: 'Name',width:200,
         renderCell:(param)=><Link to={{pathname:"/buglist",state:{pid:param.row.id,pname:param.row.name }}}>{param.row.name}</Link> },
         {field:'edit',headerName:'Edit',disableColumnMenu:true,disableColumnResize:true,renderCell:(param)=>this.editIcon(param)}
    ];

    editIcon=(param)=>{
        return(<EditIcon onClick={()=>{this.toggleEditModal();this.setState({projectId:param.row.id,projectName:param.row.name,projectDescription:param.row.description});console.log(param)}}/>)
    }

    createProject=()=>{
        console.log('calling createproject')
        let uid = cookies.get('uid')
        let iid=this.state.projectmembers  
        iid.push(Number.parseInt(uid, 10))
        // this.setState({projectmembers:iid})
        const uniquearray=Array.from(new Set(iid))

        const uri = `${API_URL}/api/project/${uid}`

        axios.post(uri,{pname:this.state.projectName,pdescription:this.state.projectDescription,pmembers:uniquearray},headers).then(
            (res)=>{console.log("createproject res",res);
            if(res.data[0].affectedRows===1){
                alert('Project added')
                this.toggleModal()
                this.getProject()
      
              }}
        ).catch(
            (rej)=>{console.log("createproject error",rej)}
        )



    }
    
    getProjectMembers(props){
        console.log("getprops",props)
        if(props){

        const uri = `${API_URL}/api/project/projectmembers/${props}`

        axios.get(uri,headers).then(
            res=>{
                this.setState({searchuser:res.data})
                console.log("resdaaa",res)}
        )}
    }
    deleteProject(){
        const pid =this.state.projectId
        const uri = `${API_URL}/api/project/${pid}`

        axios.delete(uri,headers).then(
            res=>{console.log(res)
            alert('Project Deleted Permanently')
            this.toggleEditModal()
            this.getProject()
        }
        )

    }
    updateProject(){
        const pid=this.state.projectId
        const uri = `${API_URL}/api/project/edit/${pid}`
        let uid = cookies.get('uid')


        let iid=this.state.projectmembers  
        iid.push(Number.parseInt(uid, 10))
        // this.setState({projectmembers:iid})
        const uniquearray=Array.from(new Set(iid))

        axios.put(uri,{pname:this.state.projectName,pdescription:this.state.projectDescription,pmembers:uniquearray},headers).then(
            res=>{console.log(res)
            alert("Project Updated")}
        )


    }




    render() {
        return (
            <div className={'flex-center'}>   
                <Navbar>
                <Navbar.Brand href="#home">Bug Pilot</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                
                <Navbar.Text>
                Signed in as: <a href="#login">{cookies.get('username')}</a>
                </Navbar.Text>
                </Navbar.Collapse>
                </Navbar> 


                <div style={{ width: "100vh" }}>
                    <Modal size="lg" show={this.state.editProjectModalShow} aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Edit Project
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ height: '75vh', }}>
                            <Form.Group style={{ margin: '15px' }}>
                                <Form.Label>Project Title </Form.Label>
                                <Form.Control size="lg" type="text" onChange={(event) => { this.setState({ projectName: event.target.value }, () => { console.log("bug", this.state.projectName) }) }} value={this.state.projectName} placeholder="" />
                            </Form.Group>
                            <Form.Group style={{ margin: '15px' }}>
                                <Form.Label>Description </Form.Label>
                                <Form.Control size="xl" as="textarea" onChange={(event) => this.setState({ projectDescription: event.target.value })} value={this.state.projectDescription} placeholder="" />
                            </Form.Group>
                            <div style={{  margin: '15px', }} >
                                <label>Add Members</label>
                                    <Autocomplete
                                    onChange={(option, value) =>{this.setState({projectmembers:value.map(mem=>mem.id)},()=>{console.log(this.state.projectmembers)})}}
                                    multiple
                                    id="tags-outlined"
                                    options={this.state.searchuser}
                                    getOptionLabel={(option) => option.username}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    onChange={(e)=>{this.getProjectMembers(e.target.value)}}
                                    variant="outlined"
                                    // label="filterSelectedOptions"
                                    // placeholder="Favorites"
                                    />
                                    )}
                                    />
     
                            </div>

                                        

                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => { this.deleteProject()}}>Delete</Button>
                            <Button onClick={() => { this.toggleEditModal() }}>Close</Button>
                            <Button onClick={()=>{this.updateProject()}}>Update Project</Button>
                        </Modal.Footer>
                    </Modal>
                </div>           

                <div style={{ width: "100vh" }}>
                    <Modal size="lg" show={this.state.createProjectModalShow} aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Create Project
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ height: '75vh', }}>
                            <Form.Group style={{ margin: '15px' }}>
                                <Form.Label>Project Title </Form.Label>
                                <Form.Control size="lg" type="text" onChange={(event) => { this.setState({ projectName: event.target.value }, () => { console.log("bug", this.state.projectName) }) }} value={this.state.bugTitle} placeholder="" />
                            </Form.Group>
                            <Form.Group style={{ margin: '15px' }}>
                                <Form.Label>Description </Form.Label>
                                <Form.Control size="xl" as="textarea" onChange={(event) => this.setState({ projectDescription: event.target.value })} value={this.state.projectDescription} placeholder="" />
                            </Form.Group>
                            <div style={{  margin: '15px', }} >
                                <label>Add Members</label>
                                    <Autocomplete
                                    onChange={(option, value) =>{this.setState({projectmembers:value.map(mem=>mem.id)},()=>{console.log(this.state.projectmembers)})}}
                                    multiple
                                    id="tags-outlined"
                                    options={this.state.searchuser}
                                    getOptionLabel={(option) => option.username}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    onChange={(e)=>{this.getProjectMembers(e.target.value)}}
                                    variant="outlined"
                                    // label="filterSelectedOptions"
                                    // placeholder="Favorites"
                                    />
                                    )}
                                    />
     
                            </div>

                    

                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => { this.toggleModal() }}>Close</Button>
                            <Button onClick={() => {this.createProject() }}>Create</Button>
                        </Modal.Footer>
                    </Modal>
                </div>



                <Button style={{position:'relative',right:0}} onClick={() => this.toggleModal()} variant="outline-success">Create Project</Button>
                <div style={{ height: '80vh', width: '95vw' }}>

                  <XGrid rows={this.state.rw} columns={this.cs} />

                 </div>
            </div>
        )
    }
}

export default ProjectScreen
