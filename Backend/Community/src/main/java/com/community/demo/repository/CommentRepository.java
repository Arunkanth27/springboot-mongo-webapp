package com.community.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.community.demo.entity.Comment;

//CommentRepository.java
public interface CommentRepository extends MongoRepository<Comment, String> {
 List<Comment> findByPostId(String postId);
 void deleteByPostId(String postId);
}