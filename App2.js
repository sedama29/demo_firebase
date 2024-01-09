import React, { useState, useEffect, useCallback } from 'react';
import { Button, Text } from 'react-native';
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider, getAuth } from 'firebase/auth';
import app from './firebaseConfig'; // Ensure this exports your Firebase app instance
import * as SecureStore from 'expo-secure-store';

// Initialize Firebase Auth
const auth = getAuth(app);

export const Auth = () => {
  const [user, setUser] = useState(null);

  const [, googleResponse, promptAsyncGoogle] = useIdTokenAuthRequest({

    redirectUri: 'https://auth.expo.io/@sedama/eppp', 
    androidClientId: "344100633819-jcaj8fqfstkpma1v91fcmf1ac7647g0g.apps.googleusercontent.com",
    iosClientId: "344100633819-103ng972r4avp9penivcpi0tl0gpd8a4.apps.googleusercontent.com",
    webClientId: "344100633819-f9e644i1jg9jq1odls9r5pn651spaclp.apps.googleusercontent.com",
  });

  const loginToFirebase = useCallback(async (idToken) => {
    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
  }, []);

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      loginToFirebase(googleResponse.params.id_token);
    }
  }, [googleResponse]);

  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  const handleLoginGoogle = async () => {
    await promptAsyncGoogle();
  };

  const handleLogoutGoogle = () => {
    auth.signOut();
  };

  return (
    <>
      {user ? (
        <>
          <Button title='Logout' onPress={handleLogoutGoogle} />
          <Text>Logged in as:</Text>
          <Text>{user.displayName}</Text>
          <Text>{user.email}</Text>
        </>
      ) : (
        <Button title='Login' onPress={handleLoginGoogle} />
      )}
    </>
  );
};

export default Auth;