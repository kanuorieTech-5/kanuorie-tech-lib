import { useState } from "react";
import {
  Button,
  Card,
  Input,
  Select,
  TextArea,
} from "../ui";

export default function ServiceInquiryForm({
  onSubmit,
  loading = false,
}) {
  const [form, setForm] =
    useState({
      name: "",
      email: "",
      service: "",
      budget: "",
      message: "",
    });

  const change = ({ target }) =>
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));

  return (
    <Card className="p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(form);
        }}
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

        <Select
          label="Service"
          name="service"
          value={form.service}
          onChange={change}
          options={[
            {
              label:
                "Web Development",
              value: "web",
            },
            {
              label:
                "Mobile App",
              value: "mobile",
            },
            {
              label:
                "UI/UX Design",
              value: "uiux",
            },
            {
              label:
                "Consulting",
              value: "consulting",
            },
          ]}
        />

        <Input
          label="Estimated Budget"
          name="budget"
          value={form.budget}
          onChange={change}
        />

        <TextArea
          label="Project Details"
          rows={5}
          name="message"
          value={form.message}
          onChange={change}
        />

        <Button
          loading={loading}
          type="submit"
        >
          Submit Inquiry
        </Button>
      </form>
    </Card>
  );
}