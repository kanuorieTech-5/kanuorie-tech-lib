import { useState } from "react";
import {
  Button,
  Card,
  Input,
  TextArea,
} from "../ui";

export default function TeamApplicationForm({
  loading = false,
  onSubmit,
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    position: "",
    portfolio: "",
    coverLetter: "",
  });

  const handleChange = ({ target }) => {
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  return (
    <Card className="max-w-3xl p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(form);
        }}
        className="space-y-6"
      >
        <Input
          label="Full Name"
          name="fullName"
          value={form.fullName}
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

        <Input
          label="Position Applying For"
          name="position"
          value={form.position}
          onChange={handleChange}
          required
        />

        <Input
          label="Portfolio / GitHub"
          name="portfolio"
          value={form.portfolio}
          onChange={handleChange}
        />

        <TextArea
          label="Cover Letter"
          rows={6}
          name="coverLetter"
          value={form.coverLetter}
          onChange={handleChange}
        />

        <Button
          loading={loading}
          type="submit"
        >
          Submit Application
        </Button>
      </form>
    </Card>
  );
}