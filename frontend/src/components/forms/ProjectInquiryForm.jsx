import { useState } from "react";
import {
  Button,
  Card,
  Input,
  TextArea,
} from "../ui";

export default function ProjectInquiryForm({
  onSubmit,
  loading = false,
}) {
  const [form, setForm] =
    useState({
      company: "",
      contact: "",
      email: "",
      projectType: "",
      timeline: "",
      description: "",
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
          label="Company"
          name="company"
          value={form.company}
          onChange={change}
        />

        <Input
          label="Contact Person"
          name="contact"
          value={form.contact}
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
          label="Project Type"
          name="projectType"
          value={form.projectType}
          onChange={change}
        />

        <Input
          label="Expected Timeline"
          name="timeline"
          value={form.timeline}
          onChange={change}
        />

        <TextArea
          label="Project Description"
          rows={6}
          name="description"
          value={form.description}
          onChange={change}
        />

        <Button
          loading={loading}
          type="submit"
        >
          Send Request
        </Button>
      </form>
    </Card>
  );
}