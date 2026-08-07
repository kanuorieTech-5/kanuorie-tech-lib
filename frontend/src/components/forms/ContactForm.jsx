import { useState } from "react";
import {
  Button,
  Card,
  Input,
  TextArea,
} from "../ui";

export default function ContactForm({
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = ({ target }) => {
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <Card className="max-w-3xl p-8">
      <form
        onSubmit={submit}
        className="space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
        />

        <TextArea
          label="Message"
          rows={6}
          name="message"
          value={form.message}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          loading={loading}
        >
          Send Message
        </Button>
      </form>
    </Card>
  );
}