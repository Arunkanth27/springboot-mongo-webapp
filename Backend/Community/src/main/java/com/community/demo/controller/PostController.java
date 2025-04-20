package com.community.demo.controller;

import java.awt.print.Pageable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.community.demo.dto.PostResponse;
import com.community.demo.entity.Post;
import com.community.demo.repository.PostRepository;
import com.community.demo.service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    
    @Autowired
    private PostRepository postRepository;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createPost(
        @RequestParam String content,
        @RequestParam String type,
        @RequestParam String communityId,
        @RequestParam String userEmail,
        @RequestParam String visibility,  // Add visibility parameter
        @RequestParam(required = false) MultipartFile image) {

        try {
            PostResponse response = postService.createPost(
                content,
                type,
                communityId,
                userEmail,
                visibility,  // Pass the visibility to the service
                image
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Endpoint to get posts by communityId
    @GetMapping("/by-community/{communityId}")
    public ResponseEntity<List<Post>> getPostsByCommunityId(
            @PathVariable String communityId) {
        try {
            List<Post> posts = postService.findByCommunityId(communityId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @GetMapping("/recent")
    public ResponseEntity<List<Post>> getRecentPosts(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String userEmail) {

        // PageRequest with descending order of createdAt
        PageRequest pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());

        // If userEmail is provided, filter posts by user
        if (userEmail != null && !userEmail.isEmpty()) {
            List<Post> recentPostsByUser = postRepository.findByUserEmailOrderByCreatedAtDesc(userEmail, pageable);
            return ResponseEntity.ok(recentPostsByUser);
        } else {
            List<Post> recentPosts = postRepository.findAll(pageable).getContent();
            return ResponseEntity.ok(recentPosts);
        }
    }
    @GetMapping("/public")
    public List<Post> getPublicPosts() {
        return postService.getAllPublicPosts();  // This should only return public posts
    }
    
    
}
