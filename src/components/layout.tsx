"use client";

import Header from "./header";
import Footer from "./footer";
import Socials from "./socials";

type Props = {
  locales: any;
  navigation: any;
  settings: any;
  children: any;
  uid: string;
};

export function Layout({
  locales,
  navigation,
  settings,
  children,
  uid,
}: Props) {
  // console.log("Header:", Header);
  // console.log("Footer:", Footer);
  // console.log("Socials:", Socials);

  return (
    <div className="text-slate-800" id={uid}>
      <Header locales={locales} navigation={navigation} settings={settings} />
      <main>{children}</main>
      <Socials />
      <Footer />
    </div>
  );
}
