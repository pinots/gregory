import  mongoose  from "mongoose"
import * as Mongoose from "mongoose";

export const connect = () => {
    mongoose.connect(process.env.DB_CONNECTION, () => {
        console.log('Connection to Database Established!')
      })
}

let database: Mongoose.Connection;
export const disconnect = () => {
    if (!database) {
      return;
    }
    Mongoose.disconnect();
  };