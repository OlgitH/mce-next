function Footer() {
  return (
    <section className="bg-black text-cream">
      <div className="container">
        <div className="py-28 flex flex-col items-center w-full">
          <h3 className="">
            Website built by{" "}
            <a href="https://www.aquicreative.com">AquiCreative</a>
          </h3>
          <a
            href="https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts"
            className="mx-3 mb-6 lg:mb-0"
          >
            All rights reserved. Magic Coffee Expedition.
          </a>
        </div>
      </div>
    </section>
  );
}

export default Footer;
