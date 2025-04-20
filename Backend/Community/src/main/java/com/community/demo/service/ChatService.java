package com.community.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.community.demo.entity.Message;
import com.community.demo.repository.MessageRepository;
import com.community.demo.repository.UserRepository;

@Service
public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    
    public List<Message> getMessages(String senderEmail, String receiverEmail) {
        return messageRepository.findBySenderEmailAndReceiverEmail(senderEmail, receiverEmail);
    }

    public void sendMessage(Message message) {
        messageRepository.save(message);
    }
    public boolean userExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public boolean usersExist(String email1, String email2) {
        return userRepository.findByEmail(email1).isPresent() && 
               userRepository.findByEmail(email2).isPresent();
    }

 

    // Fetch messages for a specific conversation
    public List<Message> getConversation(String user1, String user2) {
        return messageRepository.findBySenderEmailAndReceiverEmailOrderByTimestampAsc(user1, user2);
    }

    
     	
}
