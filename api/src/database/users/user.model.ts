import mongoose from 'mongoose'

interface IUser {
    email: string;
    password: string;
}

interface userModelInterface extends mongoose.Model<any> {
    build(attr: IUser):any
}
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model<any, userModelInterface>('User', userSchema)

// Function with attr param of type IUser. Expect an Object which must contain an email:string and password:string
userSchema.statics.build = (attr: IUser) => {
    return new User(attr)
}


// User.build({email: 'Dwm16@gmail.com', password:'0000'}) Correct 
// User.build({email: 'Dwm16@gmail.com', password:0000}) Error
export { User }