import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { Button, Card, SectionTitle,} from "../components/common";
import { Input, } from "../components/ui";
import { Newsletter, CTA,} from "../components/home";
import { sendContactMessage } from "../services";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const change = ({ target }) =>
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await sendContactMessage(form);

      toast.success("Message sent successfully.");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error("Unable to send message.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@kanuorietech.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+234 xxx xxx xxxx",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Nigeria",
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: "Mon - Fri • 9AM - 5PM",
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-28 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">

          <SectionTitle
            center
            light
            Badge="Contact Us"
            title="Let's Build Something Amazing Together"
            subtitle="Whether you need software development, IT consulting, or want to learn with KanuorieTech, we'd love to hear from you."
          />

        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
          <div>
            <SectionTitle
              Badge="Send a Message"
              title="We'd Love to work with You"
              subtitle="Fill out the form and we'll get back to you as soon as possible."
            />

            <Card className="mt-10 p-8">
              <form
                onSubmit={submit}
                className="space-y-6"
              >
                <Input
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={change}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={change}
                  required
                />

                <Input
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={change}
                  required
                />

                <textarea
                  name="message"
                  rows={6}
                  required
                  value={form.message}
                  onChange={change}
                  placeholder="Tell us about your project..."
                  className="w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-blue-500"
                />

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">

          {contactInfo.map((item) => (
            <Card
              key={item.title}
              className="p-8 text-center"
            >
              <item.icon className="mx-auto mb-5 h-10 w-10 text-blue-600" />

              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="mt-2 text-gray-600">
                {item.value}
              </p>
            </Card>
          ))}

        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">

          <div className="flex items-center">
            <Card className="w-full p-10">
              <h2 className="text-3xl font-bold">
                Why Contact KanuorieTech?
              </h2>

              <p className="mt-6 leading-8 text-gray-600">
                We partner with startups, businesses, and aspiring developers to create modern digital solutions and practical learning experiences.
              </p>

              <div className="mt-10 space-y-6">

                <div>
                  <h3 className="font-semibold">
                    ✔ Fast Response
                  </h3>

                  <p className="text-gray-600">
                    We aim to reply within one business day.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">
                    ✔ Professional Support
                  </h3>

                  <p className="text-gray-600">
                    Get guidance from experienced professionals.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">
                    ✔ Tailored Solutions
                  </h3>

                  <p className="text-gray-600">
                    Every project is planned around your goals and requirements.
                  </p>
                </div>

              </div>
            </Card>
          </div>

        </div>
      </section>

      <Newsletter />

      <CTA />
    </>
  );
}