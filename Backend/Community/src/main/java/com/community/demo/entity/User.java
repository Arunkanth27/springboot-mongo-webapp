package com.community.demo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getBio() {
		return bio;
	}
	public void setBio(String bio) {
		this.bio = bio;
	}
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public String getCurrentRole() {
		return currentRole;
	}
	public void setCurrentRole(String currentRole) {
		this.currentRole = currentRole;
	}
	public String getFutureGoals() {
		return futureGoals;
	}
	public void setFutureGoals(String futureGoals) {
		this.futureGoals = futureGoals;
	}
	public String getPassion() {
		return passion;
	}
	public void setPassion(String passion) {
		this.passion = passion;
	}
	public String getHobbies() {
		return hobbies;
	}
	public void setHobbies(String hobbies) {
		this.hobbies = hobbies;
	}
	public int getFollowers() {
		return followers;
	}
	public void setFollowers(int followers) {
		this.followers = followers;
	}
	public int getFollowing() {
		return following;
	}
	public void setFollowing(int following) {
		this.following = following;
	}
	public int getAttractions() {
		return attractions;
	}
	public void setAttractions(int attractions) {
		this.attractions = attractions;
	}
	public int getPoints() {
		return points;
	}
	public void setPoints(int points) {
		this.points = points;
	}
	public List<String> getBadges() {
		return badges;
	}
	public void setBadges(List<String> badges) {
		this.badges = badges;
	}
	public String getAvatarUrl() {
		return avatarUrl;
	}
	public void setAvatarUrl(String avatarUrl) {
		this.avatarUrl = avatarUrl;
	}
	public String getCoverImageUrl() {
		return coverImageUrl;
	}
	public void setCoverImageUrl(String coverImageUrl) {
		this.coverImageUrl = coverImageUrl;
	}
	public User() {
		super();
		// TODO Auto-generated constructor stub
	}
	private String username;
    private String email;
    private String password; // Added password field
    private String name;
    private String bio;
    private String summary;
    private String currentRole;
    private String futureGoals;
    private String passion;
    private String hobbies;
    private int followers;
    private int following;
    private int attractions;
    private int points;
    private List<String> badges;
    private String avatarUrl;
    private String coverImageUrl;
    
    // Constructors, getters, and setters
}