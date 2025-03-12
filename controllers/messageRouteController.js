import Conversation from "../Models/conversationalModels.js";
import Message from "../Models/messageSchema.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
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
            console.log("New Chat Created:", chat); // Debugging
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            conversationId: chat._id
        });

        console.log("New Message:", newMessage); // Debugging

        if (newMessage) {
            chat.messages.push(newMessage._id);
        }

        await Promise.all([chat.save(), newMessage.save()]);
        res.status(201).send(newMessage);
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