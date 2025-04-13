"use client";
import { useState } from "react";
import rawCountryCodes from "@/lib/countryCodes.json";
import Select from "react-select";

const translations = {
  en: {
    bookingTitle: "Book Now",
    firstName: "First Name",
    lastName: "Surname",
    email: "Email",
    phone: "Telephone",
    tour: "Tour",
    selectTour: "Select a Tour",
    submit: "Book Now",
    footer: "If you prefer to pay by bank transfer contact:",
  },
  es: {
    bookingTitle: "Reservar ahora",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo electrónico",
    phone: "Teléfono",
    tour: "Tour",
    selectTour: "Selecciona un tour",
    submit: "Reservar",
    footer: "Si prefiere pagar por transferencia de banco contacte",
  },
};

const sanitizeInput = (input: string) => {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
};

const getTranslation = (lang: string) =>
  lang?.startsWith("es") ? translations.es : translations.en;

type BookingFormProps = {
  tours: { reference: string; price: number }[];
  lang?: string;
};

const getCountryOptions = () => {
  const priority = ["GBR", "COL"];
  return [
    ...rawCountryCodes
      .filter((c) => priority.includes(c.code))
      .map((c) => ({
        value: c.dial_code,
        label: `${c.country} (${c.dial_code})`,
      })),
    ...rawCountryCodes
      .filter((c) => !priority.includes(c.code))
      .sort((a, b) => a.country.localeCompare(b.country))
      .map((c) => ({
        value: c.dial_code,
        label: `${c.country} (${c.dial_code})`,
      })),
  ];
};

const InputField = ({
  name,
  label,
  type = "text",
  value,
  onChange,
}: {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex-1">
    <label htmlFor={name} className="block text-lg font-semibold mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full rounded px-3 py-2 border"
      required
    />
  </div>
);

export default function BookingForm({ tours, lang = "en" }: BookingFormProps) {
  const t = getTranslation(lang);
  const countryOptions = getCountryOptions();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+44",
    tour: "",
    price: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
  };

  const handleCountryCodeChange = (selected: { value: string } | null) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: selected?.value || "+44",
    }));
  };

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

  const validateForm = () => {
    const { firstName, lastName, email, phone, tour } = formData;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validPhone = /^[0-9\s\-().]{6,20}$/.test(phone);

    if (!firstName || !lastName || !email || !phone || !tour)
      return alert("All fields are required.");

    if (!validEmail) return alert("Invalid email address.");
    if (!validPhone) return alert("Invalid phone number.");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fullPhone = `${formData.countryCode}${formData.phone.replace(/\s+/g, "")}`;
    const submissionData = { ...formData, phone: fullPhone };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissionData),
    });

    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-4xl text-center font-bold mb-6">{t.bookingTitle}</h2>

      <div className="flex gap-4">
        <InputField
          name="firstName"
          label={t.firstName}
          value={formData.firstName}
          onChange={handleChange}
        />
        <InputField
          name="lastName"
          label={t.lastName}
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      <InputField
        name="email"
        label={t.email}
        type="email"
        value={formData.email}
        onChange={handleChange}
      />

      <div>
        <label className="block text-lg font-semibold mb-1">{t.phone}</label>
        <div className="flex gap-2">
          <div className="w-1/3">
            <Select
              options={countryOptions}
              defaultValue={countryOptions.find(
                (opt) => opt.value === formData.countryCode
              )}
              onChange={handleCountryCodeChange}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="flex-grow rounded px-3 py-2 border"
            placeholder="e.g. 612345678"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="tour" className="block text-lg font-semibold mb-1">
          {t.selectTour}
        </label>
        <select
          name="tour"
          value={formData.tour}
          onChange={handleTourChange}
          className="w-full rounded px-3 py-2 border"
          required
        >
          <option value="">{t.selectTour}</option>
          {tours.map((tour) => (
            <option key={tour.reference} value={tour.reference}>
              {tour.reference} - £{tour.price}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-3 text-lg rounded hover:bg-gray-900 transition"
      >
        {t.submit}
      </button>
      <footer>
        <p>
          <b>{t.footer}</b>,{" "}
          <a
            href="mailto:info@magiccoffeeexpedition.co.uk"
            className="underline"
          >
            <b>info@magiccoffeeexpedition.co.uk</b>
          </a>
        </p>
      </footer>
    </form>
  );
}
