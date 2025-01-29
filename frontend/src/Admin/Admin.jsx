import AddItemForm from "./AddItemForm/AddItemForm.jsx";
import EditContact from "./EditContact/EditContact.jsx";
import EditPassword from "./EditPassword/EditPassword.jsx";

export default function Admin() {
  return (
    <>
      <div className="background">
        <AddItemForm />
        <EditContact />
        <EditPassword />
      </div>
    </>
  );
}
