import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Login from './Login';

// Mocking Axios
jest.mock('axios');

describe('Login Component', () => {
  it('should render the login form', () => {
    const { getByText, getByPlaceholderText } = render(<Login />);
    
    // Check if the form elements are rendered
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText('Log In')).toBeInTheDocument();
    expect(getByText("Don't have an account ?")).toBeInTheDocument();
  });

  it('should handle form submission with valid credentials', async () => {
    // Mocking a successful login response
    axios.post.mockResolvedValue({
      data: {
        status: true,
        user: { username: 'testUser' },
      },
    });

    const { getByPlaceholderText, getByText } = render(<Login />);

    // Enter valid credentials
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testUser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPassword' } });

    // Submit the form
    fireEvent.submit(getByText('Log In'));

    // Wait for the login process
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        username: 'testUser',
        password: 'testPassword',
      });
    });

    // Check if user is redirected after successful login
    // Note: Add a specific identifier for the element on the redirected page
    // and use getByTestId or other appropriate functions to check its presence
  });

  it('should display error toast on invalid form submission', async () => {
    // Mocking an unsuccessful login response
    axios.post.mockResolvedValue({
      data: {
        status: false,
        msg: 'Invalid credentials',
      },
    });

    const { getByPlaceholderText, getByText } = render(<Login />);

    // Submit the form without entering credentials
    fireEvent.submit(getByText('Log In'));

    // Wait for the login process
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });

    // Check if error toast is displayed
    expect(getByText('Invalid credentials')).toBeInTheDocument();
  });

  //Checking if the login form is rendered correctly.
  //Testing the form submission with valid credentials.
  //Testing the display of an error toast on invalid form submission.
});
