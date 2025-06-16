// client/src/components/GoogleOneTap.jsx
import { useEffect, useRef } from "react";
import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

const GoogleOneTap = ({ onSuccess, onError }) => {
  const googleOneTapRef = useRef(null);

  useEffect(() => {
    const initializeGoogleOneTap = () => {
      if (window.google && !googleOneTapRef.current) {
        googleOneTapRef.current = window.google.accounts.id;

        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("One Tap not displayed:", notification);
          }
        });
      }
    };

    const handleCredentialResponse = async (response) => {
      try {
        // Create credential from Google ID token
        const credential = GoogleAuthProvider.credential(response.credential);

        // Sign in with Firebase
        const result = await signInWithCredential(auth, credential);

        if (onSuccess) {
          onSuccess(result.user);
        }
      } catch (error) {
        console.error("Error with Google Sign-In:", error);
        if (onError) {
          onError(error);
        }
      }
    };

    // Load Google Identity Services script
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleOneTap;
      document.head.appendChild(script);
    } else {
      initializeGoogleOneTap();
    }

    return () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.cancel();
      }
    };
  }, [onSuccess, onError]);

  return null; // This component doesn't render anything visible
};

export default GoogleOneTap;
