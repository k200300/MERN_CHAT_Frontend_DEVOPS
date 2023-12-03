import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import Register from './Register';

// Mocking Axios
jest.mock('axios');

describe('Register Component', () => {
  it('should render the register form', () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Check if the form elements are rendered
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(getByText('Create User')).toBeInTheDocument();
    expect(getByText('Already have an account ?')).toBeInTheDocument();
  });

  it('should handle form submission with valid credentials', async () => {
    // Mocking a successful registration response
    axios.post.mockResolvedValue({
      data: {
        status: true,
        user: { username: 'testUser' },
      },
    });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Enter valid registration credentials
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testUser' } });
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPassword' } });
    fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'testPassword' } });

    // Submit the form
    fireEvent.submit(getByText('Create User'));

    // Wait for the registration process
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        username: 'testUser',
        email: 'test@example.com',
        password: 'testPassword',
      });
    });

    // Check if user is redirected after successful registration
    // Note: Add a specific identifier for the element on the redirected page
    // and use getByTestId or other appropriate functions to check its presence
  });

//   it('should display error toast on invalid form submission', async () => {
//     // Mocking an unsuccessful registration response
//     axios.post.mockResolvedValue({
//       data: {
//         status: false,
//         msg: 'Invalid credentials',
//       },
//     });

//     const { getByText, getByPlaceholderText } = render(
//       <MemoryRouter>
//         <Register />
//         <ToastContainer />
//       </MemoryRouter>
//     );

//     // Submit the form without entering credentials
//     fireEvent.submit(getByText('Create User'));

//     // Wait for the registration process
//     await waitFor(() => {
//       expect(axios.post).not.toHaveBeenCalled();
//     });

//     // Check if error toast is displayed
//     // Use react-toastify's utility function to check if toast is present
//     await waitFor(() => {
//       expect(getByText('Username should be greater than 3 characters.')).toBeInTheDocument();
//     });
//   });
});
