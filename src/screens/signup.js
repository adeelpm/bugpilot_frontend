import React, { useState} from 'react'
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import axios from 'axios'
import '../index.css'

const {API_URL}=require('../env')
// import API_URL =req

// const API_URL=process.env.REACT_APP_API_URL
function SignUp() {
    const [data, setdata] = useState({})
    const [isError, setIsError] = useState(false)
    const[errordata, setErrorData] = useState({
        res:""
    })
    


    const signuphandler =async() => {
        // console.log("signup handler called")
        if (!data.username || !data.password || !data.repassword || !data.email) {
            var temp = errordata
            if (!data.username) {
                temp.u = 'Enter a valid username'
                setErrorData(temp)
            }
            return setIsError(true)
        }



        const url = `${API_URL}/api/user/adduser`

        await axios.post(url, {
            "username": data.username,
            "email": data.email,
            "password": data.password,

        }).then((res) => {
            // console.log('then res',res)
            if(res.data.affectedRows===1){
                temp={...errordata}
                temp.res="User Created"
                setErrorData(temp)
                // console.log("after SetErrorData",errordata.res)
            }
            else if(res.data.error_code===1062)
            {
                // console.log("else if",res.data.error_message)
                temp={...errordata}
                temp.res="Username already exist"
                setErrorData(temp)
                // console.log("5 error data res",errordata.res)
                
            }
         
        })






    }

    return (
        <div className='form-parent flex-center'>

            <div className='flex-center form'  >
            <div style={{position: 'relative', bottom: '1rem'}}><h3>Sign Up</h3></div>

                <TextField className="textfiel" label="Username" variant="outlined" on onChange={(e) => {
                    const temp = data
                    temp.username = e.target.value

                    setdata(temp)
                    // console.log(data)
                }} />
                <div className="err">{errordata.u}</div>
                <TextField className="textfiel" label="E-mail" variant="outlined" onChange={(e) => {
                    const temp = data
                    temp.email = e.target.value

                    setdata(temp)
                    // console.log(data)
                }} />
                <TextField className="textfiel" label="Password" type="password" variant="outlined"
                    onChange={(e) => {
                        const temp = data
                        temp.password = e.target.value

                        setdata(temp)
                        // console.log(data)
                        if (data.repassword) {
                            if (data.password !== data.repassword) {

                                setIsError(true)
                            }
                            else {
                                setIsError(false)
                            }
                        }
                    }} />
                {/* {console.log("errror", isError)} */}
                <TextField required={true} error={isError} className="textfiel" label="Re-enter Password" type="password" variant="outlined" onChange={e => {
                    const temp = data
                    temp.repassword = e.target.value
                    setdata(temp)
                    // console.log(data)
                    // console.log(data.password, data.repassword)
                    if (data.password !== data.repassword) {
                        setIsError(true)
                    }
                    else {
                        setIsError(false)
                    }
                }} />

                <Button variant='contained' color='primary' onClick={signuphandler}>Sign up</Button>
                <div className="err">{errordata.res}</div>

            </div>

        </div>
    )
}

//
export default SignUp
