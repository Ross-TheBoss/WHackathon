import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, Button, Typography, Avatar, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

export default function GroupChat({ eventName, eventId, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    // Mock initial messages
    { id: 1, author: 'Sarah M.', content: 'Looking forward to this event!', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, author: 'Emma L.', content: 'Me too! Should we carpool?', timestamp: new Date(Date.now() - 1800000) },
    { id: 3, author: 'Rachel G.', content: 'I can drive! I have space for 3 more.', timestamp: new Date(Date.now() - 900000) }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('Guest User');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      author: username,
      content: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // TODO: Replace with actual API call to POST /chats/{eventId}/messages
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <Paper 
      elevation={6} 
      sx={{ 
        position: 'fixed', 
        bottom: 20, 
        right: 20, 
        width: 380, 
        height: 500, 
        display: 'flex', 
        flexDirection: 'column',
        zIndex: 1000
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: '#c5addc', 
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderRadius: '4px 4px 0 0'
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
          {eventName} - Group Chat
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 2, 
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5
        }}
      >
        {messages.map((msg) => (
          <Box 
            key={msg.id} 
            sx={{ 
              display: 'flex', 
              gap: 1.5,
              alignItems: 'flex-start'
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                backgroundColor: '#c5addc',
                fontSize: '0.875rem'
              }}
            >
              {getInitials(msg.author)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {msg.author}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  {formatTime(msg.timestamp)}
                </Typography>
              </Box>
              <Paper 
                sx={{ 
                  p: 1.5, 
                  backgroundColor: 'white',
                  boxShadow: 1
                }}
              >
                <Typography variant="body2">{msg.content}</Typography>
              </Paper>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          backgroundColor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            variant="outlined"
          />
          <Button 
            type="submit"
            variant="contained"
            sx={{ 
              minWidth: 'auto',
              px: 2,
              backgroundColor: '#c5addc',
              '&:hover': {
                backgroundColor: '#b399cc'
              }
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
