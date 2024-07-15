import Header from "./Header";
import Footer from "./Footer";
import Socials from "./Socials";

type Props = {
  locales: any;
  navigation: any;
  settings: any;
  children: any;
};
export function Layout({ locales, navigation, settings, children }: Props) {
  return (
    <div className="text-slate-800">
      <Header locales={locales} navigation={navigation} settings={settings} />
      <main>{children}</main>

      <Socials />
      <Footer />
    </div>
  );
}
