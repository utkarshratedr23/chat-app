import Conversation from "../Models/conversationalModels.js";
import Message from "../Models/messageSchema.js";
import { getReciverSocketId,io } from "../Socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { messages } = req.body;
        const { id: receiverId } = req.params;

        // FIX: Ensure req.user exists before accessing _id
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user found" });
        }
        
        const senderId = req.user._id; // Fix this line
        console.log("Sender ID:", senderId); // Debugging
        console.log("Receiver ID:", receiverId); // Debugging

        let chat = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        console.log("Chat Found:", chat); // Debugging

        if (!chat) {
            chat = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessages = new Message({
            senderId,
            receiverId,
            message:messages,
            conversationId: chat._id
        });

       /* console.log("New Message:", newMessage);*/ // Debugging

        if (newMessages) {
            chat.messages.push(newMessages._id);
        }

        await Promise.all([chat.save(), newMessages.save()]);
        //Socket.io function
        const reciverSocketId=getReciverSocketId(receiverId)
        console.log("Emitting newMessage event to:", reciverSocketId);
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage",newMessages)
        }
        res.status(201).send(newMessages);
    } catch (error) {
        console.log("Error in sendMessage:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMessage=async(req,res)=>{
    try{
        const{id:receiverId}=req.params;
        const senderId=req.user._id;
        const chats=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate("messages")

        if(!chats){
            return res.status(200).send([]);
        }
        const message=chats.messages;
        res.status(200).send(message)
    }
    catch(error){
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(error)
    }

}