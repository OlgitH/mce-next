"use client";
import { useState } from "react";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tour: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Pass the form data to the API (this includes name, email, tour, and date)
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // Extract the URL from the response and redirect to Stripe Checkout
    const { url } = await res.json();
    window.location.href = url; // Redirect to Stripe Checkout
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        onChange={handleChange}
        required
      />
      <select name="tour" onChange={handleChange} required>
        <option value="">Select a Tour</option>
        <option value="Safari">Safari</option>
        <option value="City Tour">City Tour</option>
      </select>
      <input type="date" name="date" onChange={handleChange} required />
      <button type="submit">Book Now</button>
    </form>
  );
}
