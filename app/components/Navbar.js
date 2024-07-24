/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebaseInit";

const Navbar = () => {
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  });

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const openConfirmLogoutModal = () => {
    document.getElementById("confirm_logout").showModal();
  };

  return (
    <>
      <nav className="flex justify-between items-center px-8 py-4">
        <div className="text-2xl">
          <h1>Find Mates</h1>
        </div>

        {/* Avatar (login) */}
        {currentUser ? (
          <div
            className="tooltip tooltip-left"
            data-tip={currentUser.displayName}
          >
            <button className="avatar" onClick={openConfirmLogoutModal}>
              <div className="w-16 rounded-full">
                <img
                  src={currentUser.photoURL}
                  alt="avatar"
                  className="block"
                />
              </div>
            </button>
          </div>
        ) : (
          <div>
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
        )}
      </nav>
      <dialog id="confirm_logout" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">
            Are you sure you want to logout?
          </h3>
          <div className="modal-action flex justify-center items-center w-full">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn mr-2">Close</button>
              <button className="btn btn-error" onClick={handleLogout}>
                Logout
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Navbar;
