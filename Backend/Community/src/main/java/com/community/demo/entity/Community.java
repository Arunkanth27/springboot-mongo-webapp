package com.community.demo.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Document(collection = "communities")
public class Community {
    @Id
    private String id;

    @NotBlank(message = "Community name is required")
    @Size(min = 3, max = 50, message = "Community name must be between 3 and 50 characters")
    private String name;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;

    private boolean isPrivate;
    private Date createdAt = new Date();
    private Date updatedAt = new Date();

    @NotBlank(message = "Creator information is required")
    private String createdBy; // Stores user email who created the community

    private List<String> members = new ArrayList<>(); // List of member emails
    private List<String> moderators = new ArrayList<>(); // List of moderator emails
    private List<String> pendingRequests = new ArrayList<>(); // For private communities
    private int postCount = 0;
    @DBRef
    private List<Post> posts = new ArrayList<>();
    
    // Other existing fields...
    
    public List<Post> getPosts() {
		return posts;
	}
	public void setPosts(List<Post> posts) {
		this.posts = posts;
	}
	public void addPost(Post post) {
        this.posts.add(post);
    }
    // Constructors
    public Community() {}

    public Community(String name, String description, boolean isPrivate, String createdBy) {
        this.name = name;
        this.description = description;
        this.isPrivate = isPrivate;
        this.createdBy = createdBy;
        this.members.add(createdBy); // Creator automatically becomes a member
        this.moderators.add(createdBy); // Creator automatically becomes a moderator
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public List<String> getModerators() {
        return moderators;
    }

    public void setModerators(List<String> moderators) {
        this.moderators = moderators;
    }

    public List<String> getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(List<String> pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public int getPostCount() {
        return postCount;
    }

    public void setPostCount(int postCount) {
        this.postCount = postCount;
    }

    // Helper methods
    public void addMember(String userEmail) {
        if (!members.contains(userEmail)) {
            members.add(userEmail);
        }
    }

    public void removeMember(String userEmail) {
        members.remove(userEmail);
        moderators.remove(userEmail);
    }

    public void addModerator(String userEmail) {
        if (!moderators.contains(userEmail)) {
            moderators.add(userEmail);
        }
    }

    public void addPendingRequest(String userEmail) {
        if (!pendingRequests.contains(userEmail)) {
            pendingRequests.add(userEmail);
        }
    }

    public void incrementPostCount() {
        postCount++;
    }
    private int anonymousJoins = 0;

	public int getAnonymousJoins() {
		return anonymousJoins;
	}
	public void setAnonymousJoins(int anonymousJoins) {
		this.anonymousJoins = anonymousJoins;
	}
}