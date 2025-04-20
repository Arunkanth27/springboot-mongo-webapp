package com.community.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.community.demo.dto.CommunityDTO;
import com.community.demo.entity.Community;
import com.community.demo.exception.CommunityNotFoundException;
import com.community.demo.exception.ErrorResponse;
import com.community.demo.repository.CommunityRepository;
import com.community.demo.service.CommunityService;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {
	  @Autowired
	    private CommunityRepository communityRepository;

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping
    public List<Community> getAllCommunities() {
        return communityService.getAllCommunities();
    }

    @PostMapping("/{communityName}/join")
    public ResponseEntity<?> joinCommunity(
            @PathVariable String communityName,
            @RequestBody Map<String, String> request) {
        
        String userEmail = request.get("userEmail");
        
        try {
            Community community = communityService.joinCommunityByName(communityName, userEmail);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "communityName", community.getName(),
                "memberCount", community.getMembers().size(),
                "members", community.getMembers()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    @PostMapping("/{communityName}/leave")
    public ResponseEntity<?> leaveCommunity(
            @PathVariable String communityName,
            @RequestBody Map<String, String> request) {
        
        String userEmail = request.get("userEmail");
        
        try {
            Community community = communityService.leaveCommunityByName(communityName, userEmail);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "communityName", community.getName(),
                "memberCount", community.getMembers().size(),
                "members", community.getMembers()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    @PostMapping
    public ResponseEntity<?> createCommunity(@RequestBody Community community) {
        try {
            Community createdCommunity = communityService.createCommunity(community);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "community", createdCommunity
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getCommunityByName(@PathVariable String name) {
        try {
            CommunityDTO community = communityService.getCommunityByName(name);
            return ResponseEntity.ok(community);
        } catch (CommunityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                   .body(new ErrorResponse("Community not found", e.getMessage()));
        }
    }
    @GetMapping("/search")
    public ResponseEntity<List<CommunityDTO>> searchCommunities(@RequestParam String query) {
        return ResponseEntity.ok(communityService.searchCommunities(query));
    }
    @GetMapping("/{userEmail}")
    public List<Community> getCommunitiesByUser(@PathVariable String userEmail) {
        return communityRepository.findByCreatedBy(userEmail);
    }

}
