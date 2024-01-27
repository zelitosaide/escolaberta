import { Form, Link } from "@remix-run/react";
import { ContactRecord } from "~/data";

export default function Contacts({ contacts }: { contacts:  ContactRecord[] }) {
  return (
    <div id="sidebar">
      <h1>Remix Contacts</h1>
      <div>
        <Form id="search-form" role="search">
          <input 
            id="q"
            type="search"
            aria-label="Search contacts"
            placeholder="Search"
            name="q"
          />
          <div 
            aria-hidden
            hidden={true}
            id="search-spinner"
          />
        </Form>
        <Form method="post">
          <button type="submit">New</button>
        </Form>
      </div>
      <nav>
        {contacts.length ? (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <Link to={`contacts/${contact.id}`}>
                  {contact.first || contact.last ? (
                    <>
                      {contact.first} {contact.last}
                    </>
                  ) : (
                    <i>No Name</i>
                  )}{" "}
                  {contact.favorite ? (
                    <span>★</span>
                  ) : null}
                </Link>
              </li>  
            ))}
          </ul>
        ): (
          <p>
            <i>No contacts</i>
          </p>
        )}
      </nav>
    </div>
  );
}