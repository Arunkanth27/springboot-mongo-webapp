import React, { useState, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch all users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/users");
        const data = await response.json();

        const formattedUsers = data.map((user) => ({
          ...user,
          displayName: user.email === currentUser?.email ? "" : user.username,
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  // Fetch messages when the selected user changes
 useEffect(() => {
  const fetchMessages = async () => {
    if (!currentUser || !selectedUser) return;

    try {
      const response = await axios.get(
        "http://localhost:8080/api/chat/conversation",
        {
          params: {
            user1: currentUser.email,
            user2: selectedUser.email,
          },
        }
      );

      // Sort messages by timestamp (oldest first)
      const sortedMessages = response.data.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      setMessages(sortedMessages); // Update messages
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]); // Clear messages on error
    }
  };

  // Call the fetchMessages function whenever currentUser or selectedUser changes
  fetchMessages();
}, [currentUser, selectedUser]); // Dependency on selectedUser and currentUser


  // Send message handler
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/chat/send",
        {
          senderEmail: currentUser.email,
          receiverEmail: selectedUser.email,
          content: newMessage,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Message sent successfully:", response.data);

      // Update UI with the new message
      setMessages((prev) => [
        ...prev,
        {
          senderEmail: currentUser.email,
          receiverEmail: selectedUser.email,
          content: newMessage,
          timestamp: new Date().toISOString(),
        },
      ]);

      setNewMessage(""); // Clear the input field after sending the message
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to send message";
      alert("Failed to send message: " + errorMessage);
    }
  };

  if (!currentUser) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>
          Please log in to view users
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#25D366",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        fontFamily: "Segoe UI, Helvetica Neue, sans-serif",
      }}
    >
      {/* Left sidebar */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #e9edef",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* User header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 16px",
            backgroundColor: "#f0f2f5",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={
                currentUser.avatar ||
                `https://i.pravatar.cc/100?u=${currentUser.email}`
              }
              alt="You"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "15px",
              }}
            />
            <span style={{ fontWeight: "600" }}>
              {currentUser.username || currentUser.email.split("@")[0]}
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f0f2f5",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              padding: "5px 10px",
              width: "200px",
            }}
          >
            <span style={{ marginRight: "10px", color: "#667781" }}>🔍</span>
            <input
              type="text"
              placeholder="Search or start new chat"
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                padding: "8px",
                fontSize: "14px",
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users list */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
                color: "#667781",
              }}
            >
              Loading users...
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f2f5",
                  cursor: "pointer",
                  backgroundColor:
                    selectedUser?.email === user.email ? "#f5f6f6" : "white",
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={user.avatar || `https://i.pravatar.cc/100?u=${user.email}`}
                    alt={user.displayName}
                    style={{
                      width: "49px",
                      height: "49px",
                      borderRadius: "50%",
                      marginRight: "15px",
                    }}
                  />
                  {user.isOnline && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0",
                        right: "15px",
                        width: "12px",
                        height: "12px",
                        backgroundColor: "#25D366",
                        borderRadius: "50%",
                        border: "2px solid white",
                      }}
                    ></div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontWeight: "600",
                        color: user.email === currentUser.email ? "#25D366" : "#111b21",
                      }}
                    >
                      {user.displayName}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#667781",
                      }}
                    >
                      {user.lastSeen
                        ? new Date(user.lastSeen).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#667781",
                      marginTop: "2px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
                color: "#667781",
              }}
            >
              No users found
            </div>
          )}
        </div>
      </div>

      {/* Right chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#e5ddd5",
          backgroundImage: "linear-gradient(#e5ddd5, #e5ddd5 55%, #d5e5e5)",
          width: "800px",
        }}
      >
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                backgroundColor: "#f0f2f5",
                borderBottom: "1px solid #e9edef",
              }}
            >
              <img
                src={
                  selectedUser.avatar ||
                  `https://i.pravatar.cc/100?u=${selectedUser.email}`
                }
                alt={selectedUser.displayName}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "15px",
                }}
              />
              <div>
                <div style={{ fontWeight: "600" }}>{selectedUser.displayName}</div>
              </div>
            </div>

            {/* Messages area */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: "16px",
                overflowY: "auto",
              }}
            >
              {messages.map((message, index) => {
                const isCurrentUser = message.senderEmail === currentUser.email;
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                     {message.replyToEmail && (
        <div style={{
          maxWidth: "60%",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          padding: "8px",
          marginBottom: "4px",
          fontSize: "14px",
          color: "#666"
        }}>
          <div style={{ fontWeight: "bold" }}>
            Replying to {message.replyToEmail === currentUser.email ? "yourself" : 
              users.find(u => u.email === message.replyToEmail)?.username || 
              message.replyToEmail.split('@')[0]}
          </div>
          <div style={{ fontStyle: "italic" }}>
            {message.replyToContent}
          </div>
        </div>
      )}
      
                    <div
                      style={{
                        maxWidth: "60%",
                        backgroundColor: isCurrentUser ? "#25D366" : "#ffffff",
                        color: isCurrentUser ? "#ffffff" : "#111b21",
                        padding: "10px 15px",
                        borderRadius: isCurrentUser ? "18px 18px 0 18px" : "18px 18px 18px 0",
                        boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                      }}
                    >
                      {!isCurrentUser && (
                        <div
                          style={{
                            fontWeight: "bold",
                            marginBottom: "4px",
                            color: isCurrentUser ? "rgba(255,255,255,0.8)" : "#555",
                          }}
                        >
                          {selectedUser.username || selectedUser.email.split("@")[0]}
                        </div>
                      )}
                      <div>{message.content}</div>
                      <div
                        style={{
                          fontSize: "11px",
                          textAlign: "right",
                          marginTop: "4px",
                          color: isCurrentUser ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                        }}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message input */}
            <div
              style={{
                display: "flex",
                padding: "8px 16px",
                backgroundColor: "#f0f2f5",
                borderTop: "1px solid #e9edef",
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "20px",
                  fontSize: "16px",
                  border: "1px solid #e9edef",
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  backgroundColor: "#25D366",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  padding: "12px",
                  cursor: "pointer",
                  marginLeft: "8px",
                }}
              >
                ➤
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              fontSize: "18px",
              color: "#667781",
            }}
          >
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
