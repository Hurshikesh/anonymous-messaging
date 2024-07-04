import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {Message} from "@/model/User"

export async function POST(request:Request){
    await dbConnect()

    const {username, content} = await request.json();

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                message: "user not found",
                success: false
                },{status: 404})          
        }
// if user accepting messages

        if(!user.isAcceptingMessages){
            return Response.json({
                message: "user is not accepting messages",
                success: false
                },{status: 403})
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            message: "message sent successfully",
            success: true
            },{status: 200})

    } catch (error) {
        console.log("error adding message",error)
        return Response.json({
            message: "internal server error",
            success: false
            },{status: 500})
    }
}