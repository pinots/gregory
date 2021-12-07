import { useEffect } from 'react'
import axios from 'axios'
import { Auth } from '../auth/signin-google'
import { useLocation } from 'react-router-dom'

export const Test = () => {
    // const token = window.localStorage.getItem('token')
    const location = useLocation()
    let { myBody } = location.state
    let { email, password } = myBody
    console.log(email)
    console.log(password)
    useEffect(() =>{
        // if(token){
        //     fetchData(token)
        // }
        if(myBody){
            register(email, password)
        }
    },[])

    // const fetchData = async(token : string) => {
    //     const res = await axios.get('http://localhost:9000/api/display',{
    //         headers: {
    //             Authorization : 'Bearer ' + token,
    //         }
    //     })
    //     console.log(res.data)
    // }
    const register = async(email: string, password: string) => {
        const res = axios.post('http://localhost:9000/register', {email, password})
        console.log(res)
    }
    return(
        <div>
            <Auth></Auth>
        </div>
    )
}