import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Box, Paper, TextField, Button, Typography, Avatar, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

export default function GroupChat({ eventName, eventId, isOpen, onClose, username }) {
  const storageKey = `groupchat_${eventId}`;
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  // Load messages from localStorage or use default mock messages
  const getInitialMessages = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (e) {
      console.error('Error loading messages from localStorage:', e);
    }
    // Default mock messages if nothing in localStorage
    return [
      { id: 1, author: 'Sarah M.', content: 'Looking forward to this event!', timestamp: new Date(Date.now() - 3600000) },
      { id: 2, author: 'Emma L.', content: 'Me too! Should we carpool?', timestamp: new Date(Date.now() - 1800000) },
      { id: 3, author: 'Rachel G.', content: 'I can drive! I have space for 3 more.', timestamp: new Date(Date.now() - 900000) }
    ];
  };

  const [messages, setMessages] = useState(getInitialMessages());
  const [newMessage, setNewMessage] = useState('');
  const [position, setPosition] = useState({ left: null, top: null });

  const clampToViewport = (left, top) => {
    const width = chatWindowRef.current?.offsetWidth ?? 380;
    const height = chatWindowRef.current?.offsetHeight ?? 500;
    const maxLeft = Math.max(0, window.innerWidth - width);
    const maxTop = Math.max(0, window.innerHeight - height);

    return {
      left: Math.min(Math.max(0, left), maxLeft),
      top: Math.min(Math.max(0, top), maxTop)
    };
  };

  const stopDragging = () => {
    dragRef.current.dragging = false;
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', stopDragging);
    document.body.style.userSelect = '';
  };

  const handleDragging = (e) => {
    if (!dragRef.current.dragging) return;

    const nextLeft = e.clientX - dragRef.current.offsetX;
    const nextTop = e.clientY - dragRef.current.offsetY;
    setPosition(clampToViewport(nextLeft, nextTop));
  };

  const handleDragStart = (e) => {
    if (e.button !== 0 || !chatWindowRef.current) return;

    const rect = chatWindowRef.current.getBoundingClientRect();
    dragRef.current = {
      dragging: true,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };

    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', stopDragging);
    document.body.style.userSelect = 'none';
  };

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving messages to localStorage:', e);
    }
  }, [messages, storageKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;

    const width = chatWindowRef.current?.offsetWidth ?? 380;
    const height = chatWindowRef.current?.offsetHeight ?? 500;
    const defaultLeft = Math.max(0, window.innerWidth - width - 20);
    const defaultTop = Math.max(0, window.innerHeight - height - 20);

    setPosition((prev) => {
      if (prev.left === null || prev.top === null) {
        return { left: defaultLeft, top: defaultTop };
      }
      return clampToViewport(prev.left, prev.top);
    });
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (prev.left === null || prev.top === null) return prev;
        return clampToViewport(prev.left, prev.top);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      stopDragging();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      author: username || 'Guest User',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
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

  const chatUi = (
    <Paper 
      ref={chatWindowRef}
      className="group-chat-window"
      elevation={0} 
      sx={{ 
        position: 'fixed', 
        top: position.top ?? 'auto',
        left: position.left ?? 'auto',
        bottom: position.top === null ? 20 : 'auto',
        right: position.left === null ? 20 : 'auto',
        width: 380, 
        height: 500, 
        minWidth: 300,
        minHeight: 340,
        maxWidth: '90vw',
        maxHeight: '85vh',
        display: 'flex', 
        flexDirection: 'column',
        zIndex: 1000,
        resize: 'both',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box 
        onMouseDown={handleDragStart}
        sx={{ 
          p: 2, 
          backgroundColor: '#192b31', 
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderRadius: '4px 4px 0 0',
          cursor: 'move',
          userSelect: 'none'
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
          {eventName} - Group Chat
        </Typography>
        <IconButton size="small" onMouseDown={(e) => e.stopPropagation()} onClick={onClose} sx={{ color: 'white' }}>
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
                  backgroundColor: 'white'
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

  if (typeof document === 'undefined') return chatUi;
  return createPortal(chatUi, document.body);
}
