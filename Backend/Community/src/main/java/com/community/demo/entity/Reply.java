package com.community.demo.entity;

import java.util.Date;
import java.util.List;

public class Reply {
    public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public List<String> getLikes() {
		return likes;
	}
	public void setLikes(List<String> likes) {
		this.likes = likes;
	}
	public Reply(String id, String content, String authorEmail, String authorName, Date createdAt, List<String> likes) {
		super();
		this.id = id;
		this.content = content;
		this.authorEmail = authorEmail;
		this.authorName = authorName;
		this.createdAt = createdAt;
		this.likes = likes;
	}
	private String id;
    private String content;
    private String authorEmail;
    private String authorName;
    private Date createdAt;
    private List<String> likes;
    
    // Constructors, getters, setters
}