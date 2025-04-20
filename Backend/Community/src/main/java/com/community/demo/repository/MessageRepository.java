package com.community.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.community.demo.entity.Message;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderEmailAndReceiverEmail(String senderEmail, String receiverEmail);
    @Query("{ $or: [ " +
            "{ $and: [ {'senderEmail': ?0}, {'receiverEmail': ?1} ] }, " +
            "{ $and: [ {'senderEmail': ?1}, {'receiverEmail': ?0} ] } " +
            "] }")
     List<Message> findConversationBetweenUsers(String user1, String user2);
    
    List<Message> findBySenderEmailAndReceiverEmailOrderByTimestampAsc(String senderEmail, String receiverEmail);
    

}
