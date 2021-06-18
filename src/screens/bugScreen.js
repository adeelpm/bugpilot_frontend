import axios from 'axios';
import Cookies from 'universal-cookie'
import React, { Component} from 'react'
import Tablee from "../components/table";
import headers from '../util/headers';
// import img from '../25.gif'
import {  Modal, Button, Form,Dropdown, Navbar } from 'react-bootstrap'
import {DropzoneArea} from 'material-ui-dropzone'
import firebase from '../firebaseconf'




import '../index.css'
import "bootstrap/dist/css/bootstrap.min.css"


const cookies = new Cookies()
// const API_URL=process.env.REACT_APP_API_URL
const {API_URL}=require('../env')





class BugScreen extends Component {



  constructor(props) {
    super(props) 
    this.state = {
      pid:this.props.location.state.pid,
      pname:this.props.location.state.pname,
      data: [],
      modalShow: false,
      bugTitle:"",
      bugDescription:'',
      bugAssignto:'',
      users:[],
      files:[],
      fileurl:[],


    }
    this.getbug()
    console.log(this.state.pid,this.state.pname,this.state.users)
  }





  getbug = async () => {
    console.log('getting bug')
    const uri = `${API_URL}/api/bug/${this.state.pid}`
    await axios.get(uri, headers).then(
      (res) => {
        this.setState({
          data: res.data,
        },()=>{
        console.log("res",this.state.data)

        })
      }
    )

  }

  createbug=()=>{

    
  //   Date.prototype.today = function () { 
  //     return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
  // }
  
  // // For the time now
  // Date.prototype.timeNow = function () {
  //      return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
  // }
    // const title=this.state.bugTitle
    // const description=this.state.bugDescription
    // const assigned_to=this.state.bugAssignto
    const assigned_by=cookies.get('username')
    console.log("assigned by,,,,",assigned_by)
    const project_id=this.state.pid
    const files=this.state.files
    let storageref=firebase.storage().ref()
    console.log("len",files.length)


  if(files.length>0){
    files.forEach((file,i,arr)=>{
      // gs://bugpilot.appspot.com/screenshots/Screenshot (98).png
        // let scref=storageref.child(`screenshots/${project_id+new Date().today() + " @ " + new Date().timeNow()+file.name}`)
        let scref=storageref.child(`screenshots/${project_id+file.name}`)
  
  
       scref.put(file).then((snapshot) => {
         // fileurl.push(scref.getDownloadURL())
         console.log('Uploaded a blob or file!');
         scref.getDownloadURL().then(url => this.setState({ fileurl: [...this.state.fileurl, url] },()=>i+1===arr.length?this.createbugpost():null))
  
       });
        console.log("arr i",i,arr.length)
  
       
  
      })

  }
  else{
    // this.setState({
    //   fileurl:null
    // },()=>{console.log('else file',this.state.fileurl)})
    this.createbugpost()
   
  }

    
  

    

  }

  createbugpost=async()=>{
    const title=this.state.bugTitle
    const description=this.state.bugDescription
    const assigned_to=this.state.bugAssignto
    const assigned_by=cookies.get('username')
    console.log("assigned by,,,,",assigned_by)
    const project_id=this.state.pid
    console.log("before post",this.state.fileurl);

    const uri = `${API_URL}/api/bug`
    const fileLessData={title,description,assigned_to,assigned_by,project_id,fileurl:null}
    const data={fileurl:this.state.fileurl}
    
      await axios.post(uri,{title,description,assigned_to,assigned_by,project_id,fileurl:'NULL'},headers).then(
        (res)=>{
          console.log(res)
          if(res.data.affectedRows===1){
            alert('Bug added')
            this.MyVerticallyCenteredModal()
            this.getbug()
          }
        }

      )
    }


  
  getMembers=async()=>{
    console.log(this.state.users.length) 
    if(this.state.users.length<=0){
      console.log('dfasf')

      const uri = `${API_URL}/api/user/getmembers/${this.state.pid}`
      
      await axios.get(uri,headers).then(
        (res)=>{
          // console.log(res)
          this.setState({
            users:res.data
          })
        }
      )
    }
  }

  MyVerticallyCenteredModal() {
    this.setState({
      modalShow: !this.state.modalShow
    })
  };


  render() {
    return (
      <>
      <div style={{width:"100vh"}}>
      <script src="https://apis.google.com/js/api.js" type="text/javascript"></script>
      <Modal  size="lg" show={this.state.modalShow}  aria-labelledby="contained-modal-title-vcenter"  centered>
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Create Bug
              </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{height:'75vh',}}>
          <Form.Group style={{margin:'15px'}}>
              <Form.Label>Bug Title </Form.Label>
              <Form.Control size="lg" type="text"  onChange={(event)=>{this.setState({bugTitle:event.target.value},()=>{console.log("bug",this.state.bugTitle)})}} value={this.state.bugTitle} placeholder=""/>           
          </Form.Group>
          <Form.Group style={{margin:'15px'}}>
              <Form.Label>Description </Form.Label>
              <Form.Control size="xl" as="textarea" onChange={(event)=>this.setState({bugDescription:event.target.value})} value={this.state.bugDescription} placeholder=""/>           
          </Form.Group>
          <Form.Group style={{margin:'15px'}} >
              <Form.Label>Assigned to </Form.Label>
              <Dropdown  onSelect={(key,e)=>{this.setState({bugAssignto:e.target.innerText})}} >
                <Dropdown.Toggle>
                   {this.state.bugAssignto?this.state.bugAssignto:'Assign to'}
                </Dropdown.Toggle>
                <Dropdown.Menu  onSelect>{
                  this.state.users.map(element => (
                    <Dropdown.Item eventKey={element.id} >{element.username}
                    </Dropdown.Item> ))
                  }
                </Dropdown.Menu>
              </Dropdown>
              {/* <Form.Control  size="lg" type="text"  onChange={(event)=>this.setState({bugAssignto:event.target.value})} value={this.state.bugAssignto} placeholder=""/>            */}
          </Form.Group>
          <div style={{margin:'15px'}}> <DropzoneArea  onChange={(file)=>{console.log(file);this.setState({files:file})}} /></div>
            </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => { this.MyVerticallyCenteredModal() }}>Close</Button>
            <Button onClick={() => { this.createbug()}}>Assign</Button>
          </Modal.Footer>
        </Modal>
        
      </div>

        <Navbar>
        <Navbar.Brand href="#home">Bug Pilot</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
        Signed in as: <a href="#login">{cookies.get('username')}</a>
        </Navbar.Text>
        </Navbar.Collapse>
        </Navbar>  

        <div className="flex-center">
          
        
          <h1>{this.state.pname}</h1>

          <Button variant="outline-primary" onClick={() => { this.MyVerticallyCenteredModal();this.getMembers();console.log(this.state.users) }} >Add Bug/Issue</Button>

          <div className="tabl">
            {
           <Tablee datas={this.state.data} pid={this.state.pid} pname={this.state.pname} uname={cookies.get('username')} refresh={this.getbug} getmem={this.getMembers} />
            }
          </div>

        </div>
      </>
    )
  }
}

export default BugScreen;


//   class index extends Component{
//     // const [modalShow, setModalShow] =useState(false);
//     constructor(props){
//     super(props)
//     this.state={
//         modalShow:false
//       }

//         }








    //  render(){
    //         return 
    //         (



    //             <div>

    //             <Button variant="primary" onClick={() => this.setState{modalShow:true}}> Launch vertically centered modal </Button>
    //             <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />

    //           </div>

    //           )
    //     }

    //     }












