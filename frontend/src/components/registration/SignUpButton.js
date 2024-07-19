import Button from '@mui/material/Button';
import * as React from 'react';

const SignUpButton = () => {
  const handleClick = () => {
    // Handle button click here
    console.log("Button clicked!");
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Click me
    </Button>
  );
}

export default SignUpButton;
