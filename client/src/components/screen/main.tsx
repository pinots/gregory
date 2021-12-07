import { SignInForm } from "../auth/signi-form"
import { Auth } from "../auth/signin-google"

export const MainScreen = () => {
    return(
        <div>
            <Auth />
            < SignInForm/>
        </div>
    )
}