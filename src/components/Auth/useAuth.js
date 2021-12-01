import React from "react";
import firebaseGoogle from "./../../firebase/firebase";
import { useEffect } from "react";
import { useState } from "react";

function useAuth() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseGoogle.auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return authUser;
}

export default useAuth;
