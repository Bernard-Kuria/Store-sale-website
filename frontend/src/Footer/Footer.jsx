export default function Footer({ phone, email }) {
  return (
    <>
      <footer>
        <h3 className="contact-info">Contact info:</h3>
        <ul>
          <li>Phone number: 0{phone}</li>
          <li>Email: {email}</li>
        </ul>
      </footer>
    </>
  );
}
