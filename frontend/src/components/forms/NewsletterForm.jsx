import { useState } from "react";
import { Button, Input } from "../ui";

export default function NewsletterForm({ onSubmit, loading = false }) {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();

    onSubmit?.({ email });

    setEmail("");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 md:flex-row">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Button type="submit" loading={loading}>
        Subscribe
      </Button>
    </form>
  );
}
