import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../../images/OIP.jpg';
import '../../components/Global.css';

const Post = ({ post }) => {
  const [showMenu, setShowMenu] = useState(false); // To track whether the menu is open or closed
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(null);

  const navigate = useNavigate();

  const toggleMenu = (e) => {
    // Prevent the event from bubbling up to the parent div and closing the menu
    e.stopPropagation();
    setShowMenu((prev) => !prev); // Toggle the menu visibility
  };

  const handleMenuOption = (option) => {
    console.log(`${option} selected for post ID: ${post.id}`);
    setShowMenu(false); // Close the menu after selecting an option
  };

  const handleLikePost = () => {
    setLiked((prev) => !prev);
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: 'User', // Replace with logged-in user's name
        content: commentText.trim(),
        likes: 0,
        liked: false,
        replies: [],
      };
      setComments([...comments, newComment]);
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  const handleLikeComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 }
          : comment
      )
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  const handleToggleReplyInput = (commentId) => {
    setShowReplyInput(showReplyInput === commentId ? null : commentId); // Toggle visibility of reply input for a specific comment
  };

  const handleAddReply = (e, commentId) => {
    e.preventDefault();
    if (replyText.trim()) {
      const newReply = {
        id: Date.now(),
        author: 'User', // Replace with logged-in user's name
        content: replyText.trim(),
      };
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
      setReplyText('');
      setShowReplyInput(null);
    }
  };

  // Handle navigation to chat page when the Message button is clicked
  const handleMessageClick = () => {
    navigate('/chat'); // Change '/chat' to your actual chat page route
  };

  return (
    <div
      className="post"
      onClick={() => {
        // Close the menu if clicking outside the post
        setShowMenu(false);
      }}
    >
      {/* Post Header */}
      <div className="post__header">
        <img src={avatar} alt="User Avatar" className="post__avatar" />
        <div className="post__user-info">
          <a href={`/profile/${post.author.toLowerCase().replace(' ', '-')}`} className="post__author">
            {post.author}
          </a>
          <span className="post__time">{post.time}</span>
        </div>

        {/* Three Dots Menu */}
        <div className="post__menu">
          <i
            className="fas fa-ellipsis-h post__menu-icon"
            onClick={toggleMenu} // Trigger the menu toggle on click
          ></i>
          {showMenu && (
            <ul className="post__menu-options">
              <li onClick={() => handleMenuOption('Save')}>Save</li>
              <li onClick={() => handleMenuOption('Share')}>Share</li>
              <li onClick={() => handleMenuOption('Report')}>Report</li>
            </ul>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="post__content">
        <h4 className="post__type">{post.type}</h4>
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="Post content" className="post__image" />}
      </div>

      {/* Post Actions */}
      <div className="post__actions">
        <span className="post__action" onClick={handleLikePost}>
          <i className={`fas fa-thumbs-up ${liked ? 'liked' : ''}`}></i> {likes} Like
        </span>
        <span className="post__action" onClick={() => setShowCommentInput(!showCommentInput)}>
          <i className="fas fa-comment"></i> Comment
        </span>
        <span className="post__action" onClick={handleMessageClick}>
          <i className="fas fa-envelope"></i> Message
        </span>
      </div>

      {/* Comment Input - Only show if Comment button is clicked */}
      {showCommentInput && (
        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit" disabled={!commentText.trim()}>Post</button>
        </form>
      )}

      {/* Comments Section */}
      <div className="post__comments">
        {comments.length > 0 &&
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <strong>{comment.author}:</strong> {comment.content}
                <span className="comment-actions">
                  <i
                    className={`fas fa-thumbs-up ${comment.liked ? 'liked' : ''}`}
                    onClick={() => handleLikeComment(comment.id)}
                  ></i> {comment.likes} Like
                  <i className="fas fa-trash-alt" onClick={() => handleDeleteComment(comment.id)}></i>
                  <i
                    className="fas fa-reply"
                    onClick={() => handleToggleReplyInput(comment.id)}
                  ></i>
                </span>
              </div>

              {showReplyInput === comment.id && (
                <form onSubmit={(e) => handleAddReply(e, comment.id)} className="reply-form">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <button type="submit" disabled={!replyText.trim()}>Reply</button>
                </form>
              )}

              {comment.replies.length > 0 && (
                <div className="replies">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="reply">
                      <strong>{reply.author}:</strong> {reply.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Post;
