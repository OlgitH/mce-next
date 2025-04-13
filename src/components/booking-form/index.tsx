"use client";
import { useState, useEffect } from "react";
import rawCountryCodes from "@/lib/countryCodes.json";

// Translation object
const translations = {
  en: {
    bookingTitle: "Book Now",
    firstName: "First Name",
    lastName: "Surname",
    email: "Email",
    phone: "Telephone",
    tour: "Tour",
    selectTour: "Select a Tour",
    selectDate: "Select Date",
    submit: "Book Now",
  },
  es: {
    bookingTitle: "Reservar ahora",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo electrónico",
    phone: "Teléfono",
    tour: "Tour",
    selectTour: "Selecciona un tour",
    selectDate: "Selecciona una fecha",
    submit: "Reservar",
  },
};

// Sanitize inputs to prevent XSS
const sanitizeInput = (input: string) => {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
};

// Helper to determine locale (fallback to English)
const getTranslation = (lang: string) =>
  lang?.startsWith("es") ? translations.es : translations.en;

type BookingFormProps = {
  tours: any[];
  tourLink?: string;
  lang?: string;
};

export default function BookingForm({
  tours,
  tourLink,
  lang = "en",
}: BookingFormProps) {
  const t = getTranslation(lang);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+44", // default UK country code
    tour: "",
    date: "",
    price: 0,
  });

  // Priority list for countries, GBR (United Kingdom) and CO (Colombia) should be on top
  const priority = ["GBR", "COL"];

  const countryCodes = [
    // Prioritize specific countries first (GB for UK, CO for Colombia)
    ...rawCountryCodes
      .filter((c) => priority.includes(c.code))
      .map((c) => ({
        code: c.dial_code,
        label: c.country,
      })),

    // Rest sorted alphabetically
    ...rawCountryCodes
      .filter((c) => !priority.includes(c.code))
      .sort((a, b) => a.country.localeCompare(b.country))
      .map((c) => ({
        code: c.dial_code,
        label: c.country,
      })),
  ];

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
  };

  // Handle tour selection
  const handleTourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTour = tours.find(
      (tour) => tour.reference === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      tour: selectedTour?.reference || "",
      price: selectedTour?.price || 0,
    }));
  };

  // Validate before submit
  const validateForm = () => {
    const { firstName, lastName, email, phone, tour } = formData;

    if (!firstName || !lastName || !email || !phone || !tour) {
      alert("All fields are required.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Phone allows digits, spaces, dashes, dots, parentheses
    const phonePattern = /^[0-9\s\-().]{6,20}$/;
    if (!phonePattern.test(phone)) {
      alert("Please enter a valid phone number.");
      return false;
    }

    return true;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const fullPhone = `${formData.countryCode}${formData.phone.replace(/\s+/g, "")}`;

    const submissionData = {
      ...formData,
      phone: fullPhone,
    };

    console.log("Submitting tour reference:", formData.tour); // Debugging log

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissionData),
    });

    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center">
        <h2 className="text-3xl">{t.bookingTitle}</h2>
      </div>

      <div className="form-row flex gap-4">
        <div className="left-col">
          <label className="text-lg block mb-1" htmlFor="firstName">
            {t.firstName}
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="right-col">
          <label className="text-lg block mb-1" htmlFor="lastName">
            {t.lastName}
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <label className="text-lg block mb-1" htmlFor="email">
          {t.email}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label className="text-lg block mb-1" htmlFor="phone">
          {t.phone}
        </label>
        <div className="flex gap-2">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          >
            {countryCodes.map(({ code, label }) => (
              <option key={code} value={code}>
                {label} ({code})
              </option>
            ))}
          </select>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 612345678"
            required
            className="flex-grow"
          />
        </div>
      </div>

      <div className="form-row">
        <label className="text-lg block mb-1" htmlFor="tour">
          {t.selectTour}
        </label>
        <select
          name="tour"
          value={formData.tour}
          onChange={handleTourChange}
          required
        >
          <option value="">{t.selectTour}</option>
          {tours.map((tour, i) => (
            <option key={tour.reference} value={tour.reference}>
              {tour.reference} - ${tour.price}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="bg-black text-white px-6 py-2 rounded">
        {t.submit}
      </button>
    </form>
  );
}
