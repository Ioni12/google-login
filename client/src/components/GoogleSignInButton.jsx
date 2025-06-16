import { useEffect, useRef } from "react";
import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

const GoogleSignInButton = () => {
  const { user } = useAuth();
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleCredentialResponse = async (response) => {
      try {
        const credential = GoogleAuthProvider.credential(response.credential);
        await signInWithCredential(auth, credential);
      } catch (error) {
        console.error("Error with Google Sign-In:", error);
      }
    };

    const renderButton = () => {
      if (window.google && buttonRef.current && !user) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 250,
        });
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderButton;
      document.head.appendChild(script);
    } else {
      renderButton();
    }
  }, [user]);

  if (user) return null;

  return (
    <div className="flex justify-center">
      <div ref={buttonRef}></div>
    </div>
  );
};

export default GoogleSignInButton;
