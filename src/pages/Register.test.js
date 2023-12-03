import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import Chat from './Chat';

// Mocking dependencies
jest.mock('socket.io-client');
jest.mock('axios');

describe('Chat Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should redirect to login page if user is not authenticated', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );

    // Check if redirected to login page
    expect(getByText('Redirecting to login...')).toBeInTheDocument();
  });

  it('should render welcome message if currentChat is undefined', async () => {
    // Mocking authenticated user in localStorage
    localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify({ _id: 'user123' }));

    const { getByText } = render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );

    // Wait for welcome message to be rendered
    await waitFor(() => {
      expect(getByText('Welcome to the chat app!')).toBeInTheDocument();
    });
  });

  it('should render ChatContainer if currentChat is defined', async () => {
    // Mocking authenticated user in localStorage
    localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify({ _id: 'user123' }));

    // Mocking a chat with a specific user
    const chatWithUser = { _id: 'otherUser123', name: 'Other User' };

    const { getByText } = render(
      <MemoryRouter>
        <Chat />
      </MemoryRouter>
    );

    // Wait for Contacts and ChatContainer to be rendered
    await waitFor(() => {
      // Find the Contact and simulate a click to open the chat
      const contactElement = getByText(chatWithUser.name);
      contactElement.click();

      // Check if ChatContainer is rendered with the selected user
      expect(getByText(`Chatting with ${chatWithUser.name}`)).toBeInTheDocument();
    });
  });

  // 
  //Redirecting to the login page if the user is not authenticated.
  //Rendering the welcome message if currentChat is undefined.
  //Rendering the ChatContainer if currentChat is defined.
});
