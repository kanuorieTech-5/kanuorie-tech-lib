import { useState } from "react";
import { Button, Card, Input, Select } from "../ui";

export default function CheckoutForm({ loading = false, onSubmit }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    paymentMethod: "paystack",
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
      <form onSubmit={submit} className="space-y-6">
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
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <Input
          label="Country"
          name="country"
          value={form.country}
          onChange={handleChange}
          required
        />

        <Select
          label="Payment Method"
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          options={[
            {
              label: "Paystack",
              value: "paystack",
            },
            {
              label: "Stripe",
              value: "stripe",
            },
          ]}
        />

        <Button type="submit" loading={loading}>
          Complete Payment
        </Button>
      </form>
    </Card>
  );
}
