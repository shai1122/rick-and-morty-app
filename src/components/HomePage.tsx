import React from "react";
import { useAuth } from "./../components/AuthContext.tsx";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.homeContainer}>
      <h2>Home Page</h2>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
      {user && user.role === "admin" ? (
        <Link to="/admin">Admin Page</Link>
      ) : (
        <Link to="/user">User Page</Link>
      )}
    </div>
  );
};

export default HomePage;
