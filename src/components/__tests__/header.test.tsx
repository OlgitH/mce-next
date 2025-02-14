// import { render, screen, fireEvent } from "@testing-library/react";
// import Header from "../header"; // Import your Header component
// import { PrismicNextLink } from "@prismicio/next";
// import { Locale, Navigation, Settings } from "@/app/types"; // Ensure your types match

// // Mock the Prismic data (this should simulate the data you get from the Prismic API)
// jest.mock("@prismicio/react", () => ({
//   PrismicNextLink: jest.fn(({ children }) => <a>{children}</a>),
// }));

// // Define the default mock navigation and settings
// const mockNavigation = {
//   data: {
//     links: [
//       { label: { text: "Home" }, link: { url: "/" } },
//       { label: { text: "About" }, link: { url: "/about" } },
//     ],
//   },
// };

// const mockSettings = {
//   data: {
//     logo: { url: "https://example.com/logo.png", alt: "Logo" },
//   },
// };

// const mockLocales = [
//   { lang: "en-gb", url: "/", lang_name: "English" },
//   { lang: "es-co", url: "/es-co", lang_name: "Spanish (Colombia)" },
// ];

// describe("Header Component", () => {
//   it("should add a new language to the language switcher", () => {
//     // Simulate adding a new language (for example, French)
//     const newLocale = { lang: "fr-fr", url: "/fr-fr", lang_name: "French" };

//     // Add the new language to the mock locales
//     const locales = [...mockLocales, newLocale];

//     // Render the Header component with the locales and mocked navigation and settings
//     render(
//       <Header
//         locales={locales}
//         navigation={mockNavigation}
//         settings={mockSettings}
//       />
//     );

//     // Assert that the new language (French) is in the language switcher
//     expect(screen.getByText("French")).toBeInTheDocument();

//     // Optionally, check if English and Spanish are also there
//     expect(screen.getByText("English")).toBeInTheDocument();
//     expect(screen.getByText("Spanish (Colombia)")).toBeInTheDocument();
//   });

//   it("should not add languages not in the locales array", () => {
//     const locales = [...mockLocales]; // Only English and Spanish

//     // Render the Header component with the locales and mocked navigation and settings
//     render(
//       <Header
//         locales={locales}
//         navigation={mockNavigation}
//         settings={mockSettings}
//       />
//     );

//     // Assert that the French language is NOT in the language switcher
//     expect(screen.queryByText("French")).not.toBeInTheDocument();
//   });
// });
