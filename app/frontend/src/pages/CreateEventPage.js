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

function FieldHeading({ children, required = false }) {
  return (
    <Typography variant="subtitle2" sx={{ mb: 0.75, fontWeight: 600 }}>
      {children}{required ? ' *' : ''}
    </Typography>
  );
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    longitude: '',
    latitude: '',
    eventType: '',
    category: '',
    capacity: '',
    startTime: '',
    endTime: '',
    image: '',
    organiserId: '' // This would typically come from auth context
  });
  const [imageName, setImageName] = useState('');

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
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        image: typeof reader.result === 'string' ? reader.result : ''
      }));
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
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
    <Container className="create-event-page" maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, backgroundColor: '#efefef' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>
          Create New Event
        </Typography>

        <Box className="create-event-form" component="form" onSubmit={handleSubmit} noValidate>
          <FieldHeading required>Event Title</FieldHeading>
          <TextField
            fullWidth
            required
            placeholder="Event title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={Boolean(errors.title)}
            helperText={errors.title}
            sx={{ mb: 2 }}
          />

          <FieldHeading>Description</FieldHeading>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Describe your event"
            name="description"
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <FieldHeading required>Category</FieldHeading>
          <TextField
            fullWidth
            required
            select
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={Boolean(errors.category)}
            helperText={errors.category}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => (
                selected
                  ? selected
                  : <span style={{ color: '#000000' }}>Select category</span>
              )
            }}
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              Select category
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <FieldHeading required>Event Type</FieldHeading>
          <TextField
            fullWidth
            required
            select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            error={Boolean(errors.eventType)}
            helperText={errors.eventType}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => (
                selected
                  ? (eventTypes.find((type) => type.value === selected)?.label || selected)
                  : <span style={{ color: '#000000' }}>Select event type</span>
              )
            }}
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              Select event type
            </MenuItem>
            {eventTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>

          <FieldHeading required>Location</FieldHeading>
          <TextField
            fullWidth
            required
            placeholder="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={Boolean(errors.location)}
            helperText={errors.location}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <FieldHeading>Event Picture</FieldHeading>
            <Button variant="outlined" component="label">
              Upload Event Picture
              <input hidden accept="image/*" type="file" onChange={handleImageChange} />
            </Button>
            {imageName && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selected: {imageName}
              </Typography>
            )}
            {formData.image && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={formData.image}
                  alt="Event preview"
                  style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 8, objectFit: 'cover' }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ width: '100%' }}>
              <FieldHeading>Latitude</FieldHeading>
              <TextField
                fullWidth
                type="number"
                placeholder="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                inputProps={{ step: 'any' }}
                helperText="Optional: GPS coordinate"
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <FieldHeading>Longitude</FieldHeading>
              <TextField
                fullWidth
                type="number"
                placeholder="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                inputProps={{ step: 'any' }}
                helperText="Optional: GPS coordinate"
              />
            </Box>
          </Box>

          <FieldHeading required>Maximum Capacity</FieldHeading>
          <TextField
            fullWidth
            required
            type="number"
            placeholder="Maximum capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            error={Boolean(errors.capacity)}
            helperText={errors.capacity}
            inputProps={{ min: 1 }}
            sx={{ mb: 2 }}
          />

          <FieldHeading required>Start Time</FieldHeading>
          <TextField
            fullWidth
            required
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            error={Boolean(errors.startTime)}
            helperText={errors.startTime}
            sx={{ mb: 2 }}
          />

          <FieldHeading required>End Time</FieldHeading>
          <TextField
            fullWidth
            required
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            error={Boolean(errors.endTime)}
            helperText={errors.endTime}
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
