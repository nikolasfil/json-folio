import React from "react";
import data from "../../../public/archived/data.json";

const ContactPage = () => {
  const contact = data.contact || {};
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <p>
        Email:{" "}
        <a href={`mailto:${contact.email}`} className="text-blue-500 underline">
          {contact.email}
        </a>
      </p>
      <p>Location: {contact.location}</p>
      <ul className="mt-4">
        {contact.socialLinks &&
          contact.socialLinks.map((link: any, idx: number) => (
            <li key={idx}>
              <a
                href={link.url}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.name}
              </a>
            </li>
          ))}
      </ul>
    </main>
  );
};

export default ContactPage;
