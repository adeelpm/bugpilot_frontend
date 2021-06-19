import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom"; 
import '../index.css';
import React,{useState} from 'react'
import axios from 'axios'
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';



let cookies = new Cookies();
// const API_URL=process.env.REACT_APP_API_URL
const {API_URL}=require('../env')

export default function Signin() {
   const [data,setdata]=useState({})
    const [error,setError]=useState('')
  
   
  
   const history=useHistory();
    const forward=(loc)=>history.push(loc)
  
  
   
    
   const SignIn=async()=>{
    // console.log(process.env.API_URL)
    // console.log(process.env.host)

  
    console.log("signin")
    var usrnme=data.username;
    var pwd=data.password;
    //
    console.log("window location",window.location.hostname,API_URL)
    await axios.post(`${API_URL}/api/signin/`,{
      "username":usrnme,
      "password":pwd
  
    }).then(
      (res)=>{
        console.log(res)
        const {message,error}=res.data
        if(message || error) {setError(message || error)}
  
        if(res.data.status){
        console.log("sign res",res)
        // console.log("sign res",res.data.qrdata[0].username)
        cookies.set('uid',res.data.qrdata[0].id,{path:'/',sameSite:true,secure:false})
        cookies.set('username',res.data.qrdata[0].username,{path:'/',sameSite:true,secure:false})
        cookies.set('token',res.data.token,{path:'/',sameSite:true,secure:false})
        // console.log("getting cookies",cookies.get('token'))
        
        // forward('/homescreen')
         forward('/projectlist')
        }
  
      }
      
    ).catch(rej=>{
      console.log("Error while sign in:",rej)
      // setError(rej)
    }
      )
  }
  
    return (
      
      <div className="form-parent flex-center" >

        
        <div className="form flex-center" >
        
        <div style={{position:'relative',top:'-3rem' }}><h3>Sign In</h3></div>
    
        <TextField  style={{}} 
        className="textfiel" label="Username" variant="outlined" onChange={(e) => {
                      const temp = data
                      temp.username = e.target.value
                      setdata(temp)
                      // console.log(2+3)
                      // console.log(data)
                  }} />
               
         <TextField style={{ }} 
        className="textfiel" label="Password" type="password" variant="outlined"
                      onChange={(e) => { const temp = data; temp.password = e.target.value; setdata(temp);
                      //  console.log(data) 
                       }} />
        <Button variant='contained' color='primary' onClick={(e)=>SignIn()}>SignIn</Button>
        <div style={{color:"red"}}> {error?error:''} </div>

        <div>
          <p style={{display:'inline' }}>No Account? </p>
          <a  style={{color:'blue'}} onClick={()=>forward('/signup')}>Signup</a>
        </div>
                    
  
        </div>
        <br/>
        
        
   
      </div>
    )}
