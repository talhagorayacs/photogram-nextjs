import dbConnect from '../../../lib/dbconnect';
import UserModel from '../../../model/user.model';
import { z } from 'zod';
import { userNameUnique } from '../../../Schema/signUpSchema';


export async function POST(request) {
    await dbConnect();
    try {
        const {username,code}= await request.json()

       const decodedUsername = decodeURIComponent(username)

       const user = await UserModel.findOne({decodedUsername})
        // const user = username
       if (!user) {
        return Response.json({
            success:false,
            message:"username does not exist"
        },{status:400})
       }

       const isCodeValid = user.verifyCode === code
        const codeValidity = new Date(user.codeExpiry)>new Date()

       if (isCodeValid && codeValidity) {
        user.isVerified = true;
        await user.save();

        return Response.json({
            success:true,
            message:"user Verified Successfully"
        },{status:200})
       } else if(!codeValidity){
        return Response.json({
            success:false,
            message:"code Expired"
        },{status:400})
       }else{
        return Response.json({
            success:false,
            message:"invalid code"
        },{status:400})
       }

    } catch (error) {
        console.error("error verifying user",error);
        
        return Response.json({
            success:false,
            message:"error verifying user"
        },{status:400})
    }
}