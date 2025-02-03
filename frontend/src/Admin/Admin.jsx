import { useState } from "react";
import AddItemForm from "./AddItemForm/AddItemForm.jsx";
import EditContact from "./EditContact/EditContact.jsx";
import EditPassword from "./EditPassword/EditPassword.jsx";

export default function Admin() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="background">
      <AddItemForm setRefresh={setRefresh} />
      <EditContact />
      <EditPassword />
    </div>
  );
}
