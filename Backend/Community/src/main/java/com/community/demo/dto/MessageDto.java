package com.community.demo.dto;


public class MessageDto {

    private String recipientId;  // The recipient's userId
    private String content;      // The content of the message

    // Getters and Setters
    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    // Constructor for convenience (optional)
    public MessageDto() {}

    public MessageDto(String recipientId, String content) {
        this.recipientId = recipientId;
        this.content = content;
    }
}
