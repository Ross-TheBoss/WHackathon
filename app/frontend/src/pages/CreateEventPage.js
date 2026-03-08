import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, MenuItem, Container, Typography, Box, Paper } from '@mui/material';

const categories = [
  'Arts & Crafts',
  'Health',
  'Technology',
  'Dance',
  'Talk',
  'Music',
  'Sports',
  'Food',
  'Gaming'
];

const eventTypes = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' }
];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    longitude: '',
    latitude: '',
    eventType: 'public',
    category: '',
    capacity: '',
    startTime: '',
    endTime: '',
    organiserId: '' // This would typically come from auth context
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = 'Capacity must be greater than 0';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    
    if (formData.startTime && formData.endTime) {
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    // TODO: Replace with actual API call
    console.log('Creating event:', formData);
    
    // For now, just navigate back to events page
    // In production, you would:
    // 1. Send POST request to /events/ endpoint
    // 2. Handle response/errors
    // 3. Navigate on success
    
    alert('Event creation will be implemented when backend is connected');
    navigate('/events');
  };

  const handleCancel = () => {
    navigate('/events');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Create New Event
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            required
            label="Event Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={Boolean(errors.title)}
            helperText={errors.title}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={Boolean(errors.category)}
            helperText={errors.category}
            sx={{ mb: 2 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            required
            select
            label="Event Type"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            {eventTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            required
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={Boolean(errors.location)}
            helperText={errors.location}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              inputProps={{ step: 'any' }}
              helperText="Optional: GPS coordinate"
            />
            <TextField
              fullWidth
              type="number"
              label="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              inputProps={{ step: 'any' }}
              helperText="Optional: GPS coordinate"
            />
          </Box>

          <TextField
            fullWidth
            required
            type="number"
            label="Maximum Capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            error={Boolean(errors.capacity)}
            helperText={errors.capacity}
            inputProps={{ min: 1 }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            type="datetime-local"
            label="Start Time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            error={Boolean(errors.startTime)}
            helperText={errors.startTime}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            type="datetime-local"
            label="End Time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            error={Boolean(errors.endTime)}
            helperText={errors.endTime}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              onClick={handleCancel}
              size="large"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: '#c5addc',
                '&:hover': {
                  backgroundColor: '#b399cc'
                }
              }}
            >
              Create Event
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
