package com.community.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "posts")
@Data
public class Post {
    @Id
    private String id;
    
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCommunityId() {
		return communityId;
	}

	public void setCommunityId(String communityId) {
		this.communityId = communityId;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public List<String> getLikedByUsers() {
		return likedByUsers;
	}

	public void setLikedByUsers(List<String> likedByUsers) {
		this.likedByUsers = likedByUsers;
	}

	public int getLikesCount() {
		return likesCount;
	}

	public void setLikesCount(int likesCount) {
		this.likesCount = likesCount;
	}

	public int getCommentsCount() {
		return commentsCount;
	}

	public void setCommentsCount(int commentsCount) {
		this.commentsCount = commentsCount;
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

	private String content;
    private String type; // e.g., "Discussion", "Question", "Announcement"
    private String communityId;
    private String userEmail;
    private String imageUrl;
    
    
    public String getVisibility() {
		return visibility;
	}

	public void setVisibility(String visibility) {
		this.visibility = visibility;
	}

	private String visibility; // "Public" or "Private"

    // Track users who liked this post
    private List<String> likedByUsers = new ArrayList<>();
    private int likesCount = 0;
    
    // For comments (could be a separate collection in a real implementation)
    private int commentsCount = 0;
    
    @CreatedDate
    private Date createdAt;
    
    @LastModifiedDate
    private Date updatedAt;

    // Helper methods for likes
    public void addLike(String userEmail) {
        if (!likedByUsers.contains(userEmail)) {
            likedByUsers.add(userEmail);
            likesCount++;
        }
    }

    public void removeLike(String userEmail) {
        if (likedByUsers.contains(userEmail)) {
            likedByUsers.remove(userEmail);
            likesCount--;
        }
    }

    // Increment comment count
    public void incrementCommentCount() {
        commentsCount++;
    }

    // Decrement comment count
    public void decrementCommentCount() {
        if (commentsCount > 0) {
            commentsCount--;
        }
    }
}