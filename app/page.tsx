import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WorkCarousel from "@/components/WorkCarousel";
import OnSite from "@/components/OnSite";
import Services from "@/components/Services";
import Engagement from "@/components/Engagement";
import Promises from "@/components/Promises";
import ContactForm from "@/components/ContactForm";
import Location from "@/components/Location";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WorkCarousel />
        <OnSite />
        <Services />
        <Engagement />
        <Promises />
        <ContactForm />
        <Location />
      </main>
      <Footer />
    </>
  );
}
