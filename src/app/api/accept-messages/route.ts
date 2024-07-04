import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User
    if(!session || !session.user){
        return Response.json({
            message: "Not Authenticated",
            success: false
            },{status: 401})
    }

    const userId = user._id
    const {acceptMessages} = await request.json()

        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {isAcceptingMessages: acceptMessages},
                {new: true}
            )
            if(!updatedUser){
                Response.json({
                    message: "failed to update user status to accept messages",
                    success: false
                    },{status: 401})
            }

            Response.json({
                message: "message acceptance status updated successfully",
                success: true,
                updatedUser
                },{status: 200})

        } catch (error) {
            console.log("failed to update user status to accept messages")
            Response.json({
                message: "failed to update user status to accept messages",
                success: false
                },{status: 500})
        }
}

export async function GET(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User
    if(!session || !session.user){
        return Response.json({
            message: "Not Authenticated",
            success: false
            },{status: 401})
    }
    const userId = user._id

   try {
    const foundUser = await UserModel.findById(userId)
    
    if(!foundUser){
        return Response.json({
            message: "user not found",
            success: false
            },{status: 404})
    }
    return Response.json({
        isAcceptingMessages: foundUser.isAcceptingMessages,
        success: true
        },{status: 200})
   } catch (error) {
            console.log("failed to update user status to accept messages")
            Response.json({
                message: "error in getting message acceptance status",
                success: false
                },{status: 500})
   }

}
