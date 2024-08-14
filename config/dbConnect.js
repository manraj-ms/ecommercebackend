import mongoose from "mongoose"

export const connectDatabase = () =>{
    mongoose.connect("mongodb://127.0.0.1:27017/ECOMMERCE").then((con)=>{
        console.log(`MongoDB running`)
    })
}