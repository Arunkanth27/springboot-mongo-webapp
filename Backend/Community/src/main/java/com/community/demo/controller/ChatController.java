package com.community.demo.controller;

import com.community.demo.entity.Message;
import com.community.demo.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class ChatController {

	@Autowired
	private ChatService chatService;

	@GetMapping("/messages")
	public ResponseEntity<List<Message>> getMessages(@RequestParam String senderEmail,
			@RequestParam String receiverEmail) {

		List<Message> messages = chatService.getMessages(senderEmail, receiverEmail);
		if (messages.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // No content if empty
		}
		return ResponseEntity.ok(messages); // Return messages with HTTP status 200
	}

	@PostMapping("/send")
	public ResponseEntity<String> sendMessage(@RequestBody Message message) {
		try {
			chatService.sendMessage(message);
			return ResponseEntity.status(HttpStatus.CREATED).body("Message sent successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error sending message: " + e.getMessage());
		}
	}

	@GetMapping("/conversation")
	public ResponseEntity<List<Message>> getConversation(
	        @RequestParam String user1,
	        @RequestParam String user2) {
	    
	    // Verify both users exist in database
	    if (!chatService.usersExist(user1, user2)) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	    }

	    List<Message> conversation = chatService.getConversation(user1, user2);
	    return ResponseEntity.ok(conversation);
	}

}
