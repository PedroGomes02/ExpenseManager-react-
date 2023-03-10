//FIREBASE IMPORTS firebase.ts
import { auth } from "./firebase";
// AUTH IMPORTS
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

import { useEffect, useState } from "react";
import "./styles.css";

import NewMovement from "./components/NewMovement";
import Movements from "./components/Movements";
import Header from "./components/Header";
import Summary from "./components/Summary";
import Login from "./components/Login";
import Loading from "./components/Loading";

import { getUserData } from "./utils";
import { Category, Movement } from "./types";

export default function App() {
  // AUTH Hook and Functions
  const [user, loading] = useAuthState(auth);
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };
  const signOut = () => {
    auth.signOut();
  };

  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(true);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getUserData(setCategories, setMovements, setIsUserDataLoading);
  }, []);

  return (
    <div className="App">
      <Header
        googleSignIn={googleSignIn}
        signOut={signOut}
        loading={loading}
        user={user}
        isUserDataLoading={isUserDataLoading}
      />

      {loading ? (
        <Loading />
      ) : !user ? (
        <Login googleSignIn={googleSignIn} />
      ) : isUserDataLoading ? (
        <Loading />
      ) : (
        <>
          <Summary movements={movements} categories={categories} />
          <NewMovement
            setMovements={setMovements}
            categories={categories}
            user={user}
          />
          <Movements
            movements={movements}
            setMovements={setMovements}
            categories={categories}
          />
        </>
      )}
    </div>
  );
}
