import { Fragment, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';

import axios from 'axios';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import Pages from '@/routes/Pages';
import Header from '@/sections/Header';
import HotKeys from '@/sections/HotKeys';
import Notifications from '@/sections/Notifications';
import SW from '@/sections/SW';
import Sidebar from '@/sections/Sidebar';

interface UserClaim {
  typ: string; // The type of claim, e.g., "name", "email"
  val: string; // The value of the claim
}

interface UserInfo {
  id_token: string; // Encoded ID token
  access_token: string; // Encoded access token
  provider_name: string; // Name of the authentication provider, e.g., "aad"
  user_claims: UserClaim[]; // Array of claims
  user_id: string; // User ID
}

async function sendUserDataToBackend(email: string, email_verified: UserClaim): Promise<void>{
  try{
    const response = await axios.post('/api/user-data', {email, email_verified});
    console.log('data sent to backend', response.data)
  } catch (err) {
    console.error("Error sending the user data to backend", err)
    
  }
}

function App() {
  useEffect(() => {
    const fetchUserData = async (): Promise<UserInfo | null> => {
      try {
        const response = await axios.get<UserInfo[]>('/.auth/me', {
          withCredentials: true, // Ensures cookies are sent for authentication
        });
        const email = response.data[0]["user_id"]
        const email_verified = response.data[0]["user_claims"][5]
        console.log(email, " ", email_verified)

        if (response.status === 200 && response.data.length > 0) {
          console.log('user info: ', response.data);
          await sendUserDataToBackend(email, email_verified)
          return response.data[0]; // Return the first user info object
        } else {
          console.error('No user data available:', response.data);
          return null;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    };

    fetchUserData();
  }, []);

  return (
    <Fragment>
      <CssBaseline />
      <Notifications />
      <HotKeys />
      <SW />
      <BrowserRouter>
        <Header />
        <Sidebar />
        <Pages />
      </BrowserRouter>
    </Fragment>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
