import AddItemForm from "./AddItemForm/AddItemForm.jsx";
import EditContact from "./EditContact/EditContact.jsx";
import EditPassword from "./EditPassword/EditPassword.jsx";

export default function Admin({ store, setRefresh }) {
  return (
    <>
      <div className="background">
        <AddItemForm store={store} setRefresh={setRefresh} />
        <EditContact />
        <EditPassword />
      </div>
    </>
  );
}
