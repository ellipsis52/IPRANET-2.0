import { useEffect, useState } from 'react';

function Contacts({ token, tenantId }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/contacts?token=${token}&tenantId=${tenantId}`)
      .then(res => res.json())
      .then(data => {
        setContacts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token, tenantId]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Contacts</h2>
      <ul className="space-y-2">
        {contacts.map(contact => (
          <li key={contact.ContactID} className="border p-3 rounded bg-white shadow">
            <strong>{contact.Name}</strong><br />
            Email : {contact.EmailAddress}<br />
            Téléphone : {contact.PhoneNumber}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Contacts;
