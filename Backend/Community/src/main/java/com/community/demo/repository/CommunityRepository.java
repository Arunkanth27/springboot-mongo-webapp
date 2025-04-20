package com.community.demo.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.community.demo.entity.Community;

public interface CommunityRepository extends MongoRepository<Community, String> {
    
    // Find by exact name
    Optional<Community> findByName(String name);
    
    

    // Check if community exists by name
    boolean existsByName(String name);
    
    // Find communities where user is a member
    List<Community> findByMembersContaining(String userEmail);
    
    // Find communities where user is a moderator
    List<Community> findByModeratorsContaining(String userEmail);
    
    // Search communities by name (case-insensitive)
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Community> searchByName(String name);
    
    // Find public communities
    List<Community> findByIsPrivateFalse();
    
    // Find communities created by a specific user
    List<Community> findByCreatedBy(String userEmail);
    
    // Count communities created by a user
    long countByCreatedBy(String userEmail);
    
    // Find communities with pending requests for a user
    List<Community> findByPendingRequestsContaining(String userEmail);
    // Custom query to find community and check membership in one operation
    @Query(value = "{'_id': ?0}", fields = "{'name': 1, 'members': 1}")
    Optional<Community> findCommunityWithMembers(String communityId);

    // Check if user is member of a specific community
    @Query(value = "{'_id': ?0, 'members': ?1}", count = true)
    int isUserMember(String communityId, String userId);

    // Find all communities user has joined
    @Query("{'members': ?0}")
    List<Community> findCommunitiesByMember(String userId);

    // Efficient member count update
    @Query("UPDATE communities SET members = CASE WHEN ?1 IN members THEN $pull ELSE $addToSet END WHERE _id = ?0")
    void toggleMembership(String communityId, String userId);
    
    Optional<Community> findById(ObjectId id);  // This is equivalent to findById in MongoRepository
    
    List<Community> findByNameContainingIgnoreCase(String name);
    
    

}