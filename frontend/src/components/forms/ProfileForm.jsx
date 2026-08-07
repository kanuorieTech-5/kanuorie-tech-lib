import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  TextArea,
} from "../ui";

export default function ProfileForm({
  user = {},
  loading = false,
  onSubmit,
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      bio: user.bio || "",
    });
  }, [user]);

  const handleChange = ({ target }) => {
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <Card className="max-w-3xl p-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <Input
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <TextArea
          label="Bio"
          rows={5}
          name="bio"
          value={form.bio}
          onChange={handleChange}
        />

        <Button
          type="submit"
          loading={loading}
        >
          Save Changes
        </Button>
      </form>
    </Card>
  );
}