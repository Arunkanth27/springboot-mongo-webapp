package com.community.demo.entity;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPostId() {
		return postId;
	}
	public void setPostId(String postId) {
		this.postId = postId;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getAuthorEmail() {
		return authorEmail;
	}
	public void setAuthorEmail(String authorEmail) {
		this.authorEmail = authorEmail;
	}
	public String getAuthorName() {
		return authorName;
	}
	public void setAuthorName(String authorName) {
		this.authorName = authorName;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	public List<Reply> getReplies() {
		return replies;
	}
	public void setReplies(List<Reply> replies) {
		this.replies = replies;
	}
	public List<String> getLikes() {
		return likes;
	}
	public void setLikes(List<String> likes) {
		this.likes = likes;
	}
	public Comment(String id, String postId, String content, String authorEmail, String authorName, Date createdAt,
			List<Reply> replies, List<String> likes) {
		super();
		this.id = id;
		this.postId = postId;
		this.content = content;
		this.authorEmail = authorEmail;
		this.authorName = authorName;
		this.createdAt = createdAt;
		this.replies = replies;
		this.likes = likes;
	}
	private String postId;
    private String content;
    private String authorEmail;
    private String authorName;
    private Date createdAt;
    private List<Reply> replies;
    private List<String> likes;
    
    // Constructors, getters, setters
}