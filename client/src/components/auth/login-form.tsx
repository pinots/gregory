import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
// import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router';

export const Login = () => {
    let navigate = useNavigate()
    const defaultValues = {
        email: '',
        password:'',
      };
    const [formValues, setFormValues] = useState(defaultValues)
    // const navigate = useNavigate()
    const handleInputChange = (e: any) => {
        const { name, value} = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        })
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        let {email , password } = formValues
        axios.post('http://localhost:9000/login', {email, password})
        .then((result) => {if(result.data.status === 'ok'){
            console.log('Got the token: ', result.data.data)
            navigate('/plaid')
        }else{
            alert(result.data.error)
        }})
      };

    return(
        <Container maxWidth="sm" sx={{height:'100vh', display:'flex', alignItems:'center'}}>
        <Box sx={{width:'1',height:'50vh',display: 'flex' ,flexDirection:'column', justifyContent:'center', bgcolor:'white'}}>
            <form onSubmit={handleSubmit}>
                <Box sx={{display:'flex',flexDirection:'column' ,alignItems:'center' ,height:'20vh', width:'75%'}}>
                <TextField id="outlined-basic" label="Enter Your Email" type='text' name='email'variant="outlined" size="small" value={formValues.email} onChange={handleInputChange}/>
                <TextField id="outlined-basic" label="Enter Your Password" type='text' name='password'variant="outlined" size="small" value={formValues.password} onChange={handleInputChange}/>
                <Button variant="contained" type="submit">Login</Button>
                </Box>
            </form>
        </Box>
        </Container>
    )
}