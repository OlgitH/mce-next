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
    selectTour: "Select Tickets",
    submit: "Book Now",
    footer: "If you prefer to pay by bank transfer contact:",
    adultLabel: "Adults",
    childrenLabel: "Children",
  },
  es: {
    bookingTitle: "Reservar ahora",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo electrónico",
    phone: "Teléfono",
    tour: "Tour",
    selectTour: "Selecciona entradas",
    submit: "Reservar",
    footer: "Si prefiere pagar por transferencia de banco contacte",
    adultLabel: "Adultos",
    childrenLabel: "Niños",
  },
};

const sanitizeInput = (input: string) => {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
};

const getTranslation = (lang: string) =>
  lang?.startsWith("es") ? translations.es : translations.en;

type Tour = {
  reference: string | null;
  label: string | null;
  price: number | null;
  price_children?: number | null;
};

type BookingFormProps = {
  tours: Tour[];
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
  });

  // Use quantityAdult and quantityChildren consistently
  const [selectedTickets, setSelectedTickets] = useState<
    {
      reference: string;
      label: string;
      price: number;
      quantityAdult: number;
      quantityChildren: number;
      priceChildren: number;
    }[]
  >([]);

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
  const getFullPhone = () =>
    `${formData.countryCode}${formData.phone.replace(/\s+/g, "")}`;

  // Centralized handler for quantity changes
  const handleTicketQuantityChange = (
    tour: Tour,
    qty: number,
    type: "adult" | "children"
  ) => {
    if (!tour.reference || tour.price === null) return;

    const reference = tour.reference; // now reference is string
    const fullPhone = getFullPhone();
    const submissionData = {
      ...formData,
      phone: fullPhone,
      tickets: selectedTickets,
      totalPrice: selectedTickets.reduce(
        (sum, ticket) =>
          sum +
          ticket.price * ticket.quantityAdult +
          (ticket.priceChildren || 0) * ticket.quantityChildren,
        0
      ),
    };
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone } = formData;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validPhone = /^[0-9\s\-().]{6,20}$/.test(phone);

    if (!firstName || !lastName || !email || !phone)
      return alert("All fields are required.");
    if (!validEmail) return alert("Invalid email address.");
    if (!validPhone) return alert("Invalid phone number.");
    if (selectedTickets.length === 0)
      return alert("Please select at least one ticket.");

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fullPhone = getFullPhone();
    const submissionData = {
      ...formData,
      phone: fullPhone,
      tickets: selectedTickets,
      totalPrice: selectedTickets.reduce(
        (sum, ticket) =>
          sum +
          ticket.price * ticket.quantityAdult +
          (ticket.priceChildren || 0) * ticket.quantityChildren,
        0
      ),
    };

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
        <label className="block text-lg font-semibold mb-1">
          {t.selectTour}
        </label>
        {tours.map((tour, i) => {
          const existing = selectedTickets.find(
            (t) => t.reference === tour.reference
          );
          return (
            <div key={i} className="flex flex-col gap-2 my-10">
              <span className="font-semibold text-lg">{tour.label}</span>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2">
                  {t.adultLabel}:
                  <select
                    value={existing?.quantityAdult || 0}
                    onChange={(e) =>
                      handleTicketQuantityChange(
                        tour,
                        parseInt(e.target.value, 10),
                        "adult"
                      )
                    }
                    className="border rounded px-2 py-1 w-20 text-center text-black"
                  >
                    {[...Array(6)].map((_, qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-2">
                  {t.childrenLabel}:
                  <select
                    value={existing?.quantityChildren || 0}
                    onChange={(e) =>
                      handleTicketQuantityChange(
                        tour,
                        parseInt(e.target.value, 10),
                        "children"
                      )
                    }
                    className="border rounded px-2 py-1 w-20 text-center text-black"
                  >
                    {[...Array(6)].map((_, qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-right font-bold text-xl">
        Total: £
        {selectedTickets.reduce(
          (total, ticket) =>
            total +
            ticket.price * ticket.quantityAdult +
            (ticket.priceChildren || 0) * ticket.quantityChildren,
          0
        )}
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
