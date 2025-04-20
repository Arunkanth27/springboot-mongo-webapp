package com.community.demo.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.community.demo.entity.User;
import com.community.demo.repository.CommunityRepository;
import com.community.demo.repository.PostRepository;
import com.community.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private CommunityRepository communityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PostRepository postRepository;

//    @GetMapping("/community")
//    public ResponseEntity<Map<String, Object>> getCommunityStats() {
//        Map<String, Object> stats = new HashMap<>();
//        
//        // Basic counts
//        stats.put("totalCommunities", communityRepository.count());
//        stats.put("totalUsers", userRepository.count());
//        stats.put("totalPosts", postRepository.count());
//        
//        // Active users (last 24 hours)
//        Date yesterday = new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000);
//        stats.put("activeUsers", userRepository.countByLastActiveAfter(yesterday));
//        
//        // Top 5 users by points
//        List<User> topUsers = userRepository.findTop5ByOrderByPointsDesc();
//        stats.put("topUsers", topUsers.stream()
//            .map(user -> Map.of(
//                "id", user.getId(),
//                "name", user.getName(),
//                "username", user.getUsername(),
//                "profilePic", user.getProfilePic(),
//                "points", user.getPoints(),
//                "followers", user.getFollowers().size()
//            ))
//            .collect(Collectors.toList()));
//        
//        return ResponseEntity.ok(stats);
//    }
}