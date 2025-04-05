import React, { useState } from 'react';
import { 
  Box, 
  Tab,
  Tabs,
  Typography,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminTabPanel = ({ formData, setFormData, hotels, restaurants, attractions }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="admin tabs"
        >
          <Tab label="Overview" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={value} index={0}>
        <Typography variant="body2" color="text.secondary" paragraph>
          The Overview tab provides additional in-depth information about the attraction beyond the main description.
          This includes detailed history, cultural context, and expanded details that don't fit in the main description.
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          label="Overview Content"
          name="overview"
          value={formData.overview || ''}
          onChange={handleInputChange}
          margin="normal"
          helperText="Detailed content for the Overview tab - this complements the main Description and provides additional detailed information about the attraction"
        />
      </TabPanel>
    </Box>
  );
};

export default AdminTabPanel; 