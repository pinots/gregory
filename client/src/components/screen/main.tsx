import { Login } from "../auth/login-form"
import { SignInForm } from "../auth/signin-form"
import { Auth } from "../auth/signin-google"

export const MainScreen = () => {
    return(
        <div>
            <Login/>
            {/* < SignInForm/> */}
        </div>
    )
}