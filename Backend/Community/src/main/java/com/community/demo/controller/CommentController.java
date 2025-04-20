package com.community.demo.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.community.demo.entity.Comment;
import com.community.demo.entity.Reply;
import com.community.demo.repository.CommentRepository;

//CommentController.java
@RestController
@RequestMapping("/api/comments")
public class CommentController {
 
 @Autowired
 private CommentRepository commentRepository;
 
 @PostMapping
 public Comment addComment(@RequestBody Comment comment) {
     comment.setCreatedAt(new Date());
     return commentRepository.save(comment);
 }
 
 @GetMapping("/post/{postId}")
 public List<Comment> getCommentsByPost(@PathVariable String postId) {
     return commentRepository.findByPostId(postId);
 }
 
 @PostMapping("/{commentId}/replies")
 public Comment addReply(@PathVariable String commentId, @RequestBody Reply reply) {
     Comment comment = commentRepository.findById(commentId).orElseThrow();
     reply.setId(UUID.randomUUID().toString());
     reply.setCreatedAt(new Date());
     if (comment.getReplies() == null) {
         comment.setReplies(new ArrayList<>());
     }
     comment.getReplies().add(reply);
     return commentRepository.save(comment);
 }
 
 @DeleteMapping("/{commentId}")
 public void deleteComment(@PathVariable String commentId) {
     commentRepository.deleteById(commentId);
 }
 
 @DeleteMapping("/post/{postId}")
 public void deleteCommentsByPost(@PathVariable String postId) {
     commentRepository.deleteByPostId(postId);
 }
}