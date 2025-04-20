package com.community.demo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "messages")
public class Message {

    @Id
    private String id;
    private String senderEmail;
    private String receiverEmail;
    private String content;
    private String timestamp;
    private String replyToEmail; // Email of sender being replied to
    public String getReplyToEmail() {
		return replyToEmail;
	}

	public void setReplyToEmail(String replyToEmail) {
		this.replyToEmail = replyToEmail;
	}

	public String getReplyToContent() {
		return replyToContent;
	}

	public void setReplyToContent(String replyToContent) {
		this.replyToContent = replyToContent;
	}

	private String replyToContent; // Content of message being replied to

    // Constructor, Getters, and Setters
    public Message(String senderEmail, String receiverEmail, String content, String timestamp) {
        this.senderEmail = senderEmail;
        this.receiverEmail = receiverEmail;
        this.content = content;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
