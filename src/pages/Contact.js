import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      {submitted ? (
        <p className="text-green-600">Thank you for your message!</p>
      ) : (
        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border px-3 py-2 rounded"
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            className="w-full border px-3 py-2 rounded"
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
            Send
          </button>
        </form>
      )}
    </div>
  );
} 