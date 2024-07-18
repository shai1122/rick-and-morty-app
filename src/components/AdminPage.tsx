import React from "react";

import CharacterTable from "./CharacterTable.tsx";

import styles from "./AdminPage.module.css";

const AdminPage: React.FC = () => {
  const columns = ["id", "name", "status", "species", "type", "gender"];

  return (
    <div className={`${styles.container} ${styles.adminContainer}`}>
      <h2>Admin Page</h2>
      <CharacterTable columns={columns} />
    </div>
  );
};

export default AdminPage;
