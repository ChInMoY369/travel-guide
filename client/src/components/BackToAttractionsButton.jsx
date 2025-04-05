import React from 'react';
import { Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BackToAttractionsButton = ({ 
  variant = 'text', 
  color = 'inherit', 
  size = 'medium',
  sx = { mb: 2 } 
}) => {
  const navigate = useNavigate();

  return (
    <Button
      startIcon={<ArrowBack />}
      onClick={() => navigate('/attractions')}
      variant={variant}
      color={color}
      size={size}
      sx={sx}
    >
      Back to Attractions
    </Button>
  );
};

export default BackToAttractionsButton; 