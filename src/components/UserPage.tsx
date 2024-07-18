import React from "react";
import CharacterTable from "./CharacterTable.tsx";
import styles from "./UserPage.module.css";

const UserPage: React.FC = () => {
  const columns = ["id", "name", "status", "species"];

  return (
    <div className={`${styles.container} ${styles.userContainer}`}>
      <h2>User Page</h2>
      <CharacterTable columns={columns} />
    </div>
  );
};

export default UserPage;
