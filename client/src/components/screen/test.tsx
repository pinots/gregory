import { useEffect } from 'react'
import axios from 'axios'
import { Auth } from '../auth/signin-google'
export const Test = () => {
    const token = window.localStorage.getItem('token')
    console.log(token)
    
    useEffect(() =>{
        if(token){
            fetchData(token)
        }
    },[token])

    const fetchData = async(token : string) => {
        const res = await axios.get('http://localhost:9000/api/display',{
            headers: {
                Authorization : 'Bearer ' + token,
            }
        })
        console.log(res.data)
    }
    return(
        <div>
            <Auth></Auth>
        </div>
    )
}