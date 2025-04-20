package com.community.demo.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.community.demo.dto.PostResponse;
import com.community.demo.entity.Post;
import com.community.demo.repository.PostRepository;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final String UPLOAD_DIR = "uploads/";

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public PostResponse createPost(
    	    String content, 
    	    String type, 
    	    String communityId,
    	    String userEmail,
    	    String visibility,  // Add visibility parameter
    	    MultipartFile image) throws IOException {

    	    // Create a new post instance
    	    Post post = new Post();
    	    post.setContent(content);
    	    post.setType(type);
    	    post.setCommunityId(communityId);
    	    post.setUserEmail(userEmail);  // Add user email to post
    	    post.setVisibility(visibility);  // Set visibility (Public/Private)
    	    
    	    post.setCreatedAt(new Date());
    	    post.setUpdatedAt(new Date());

    	    // If an image is provided, save it and set the image URL in the post
    	    if (image != null && !image.isEmpty()) {
    	        String imageUrl = saveImage(image);
    	        post.setImageUrl(imageUrl);
    	    }

    	    // Save the post to the database
    	    Post savedPost = postRepository.save(post);

    	    // Convert the saved post to a response object and return it
    	    return convertToResponse(savedPost);
    	}


    private String saveImage(MultipartFile image) throws IOException {
        byte[] bytes = image.getBytes();
        String originalFileName = image.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String newFileName = UUID.randomUUID().toString() + fileExtension;
        
        Path path = Paths.get(UPLOAD_DIR + newFileName);
        Files.createDirectories(path.getParent());
        Files.write(path, bytes);
        
        return newFileName;
    }

    private PostResponse convertToResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setType(post.getType());
        response.setCommunityId(post.getCommunityId());
        response.setUserEmail(post.getUserEmail());  // Include email in response
        response.setImageUrl(post.getImageUrl());
      
        return response;
    }
    public List<Post> findByCommunityId(String communityId) {
        return postRepository.findByCommunityId(communityId);
    }
    // Get all public posts
    public List<Post> getAllPublicPosts() {
        return postRepository.findByVisibility("Public");
    }
}