package com.community.demo.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.community.demo.dto.CommunityDTO;
import com.community.demo.entity.Community;
import com.community.demo.exception.CommunityNotFoundException;
import com.community.demo.repository.CommunityRepository;
import com.community.demo.repository.UserRepository;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    public CommunityService(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
		this.userRepository = null;
    }

    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Community joinCommunityByName(String communityName, String userEmail) {
        Community community = communityRepository.findByName(communityName)
                .orElseThrow(() -> new RuntimeException("Community not found"));
        
        if (userEmail == null || userEmail.isEmpty()) {
            throw new IllegalArgumentException("User email is required");
        }
        
        if (!community.getMembers().contains(userEmail)) {
            community.addMember(userEmail);
            community.setUpdatedAt(new Date());
            return communityRepository.save(community);
        }
        
        return community; // Already a member
    }
    public Community getCommunityById(String communityId) {
        // Assuming you have a method to find a community by its ID
        return communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));
    }

    public void saveCommunity(Community community) {
        communityRepository.save(community);
    }
    public Community leaveCommunityByName(String communityName, String userEmail) {
        Community community = communityRepository.findByName(communityName)
                .orElseThrow(() -> new RuntimeException("Community not found"));
        
        if (userEmail == null || userEmail.isEmpty()) {
            throw new IllegalArgumentException("User email is required");
        }
        
        if (community.getMembers().contains(userEmail)) {
            community.removeMember(userEmail);
            community.setUpdatedAt(new Date());
            return communityRepository.save(community);
        }
        
        return community; // Already not a member
    }
    public Community createCommunity(Community community) {
        // Check if community name already exists
        if (communityRepository.existsByName(community.getName())) {
            throw new RuntimeException("Community name already exists");
        }
        
        // Set creation timestamp
        community.setCreatedAt(new Date());
        community.setUpdatedAt(new Date());
        
        // Initialize members list
        if (community.getMembers() == null) {
            community.setMembers(List.of(community.getCreatedBy()));
        } else {
            community.getMembers().add(community.getCreatedBy());
        }
        
        return communityRepository.save(community);
    }
    
    public void incrementPostCount(String communityId) {
        communityRepository.findById(communityId).ifPresent(community -> {
            community.setPostCount(community.getPostCount() + 1);
            communityRepository.save(community);
        });
    }

    private CommunityDTO mapToDTO(Community community) {
        CommunityDTO dto = new CommunityDTO();
        dto.setId(community.getId());
        dto.setName(community.getName());
        dto.setDescription(community.getDescription());
        dto.setPrivate(community.isPrivate());
        dto.setCreatedAt(community.getCreatedAt());
        dto.setCreatedBy(community.getCreatedBy());
        dto.setMembers(community.getMembers());
        dto.setMemberCount(community.getMembers().size());
        dto.setPostCount(community.getPostCount());
        return dto;
    }
 

    public CommunityDTO getCommunityByName(String name) throws CommunityNotFoundException {
        Optional<Community> communityOpt = communityRepository.findByName(name);
        if (communityOpt.isPresent()) {
            return mapToDTO(communityOpt.get());
        } else {
            throw new CommunityNotFoundException("Community not found with name: " + name);
        }
    }

    public List<CommunityDTO> searchCommunities(String searchTerm) {
        return communityRepository.findByNameContainingIgnoreCase(searchTerm)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    

}