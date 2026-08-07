import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  Select,
  TextArea,
} from "../ui";

export default function AdminBookForm({
  initialData = {},
  loading = false,
  onSubmit,
}) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    coverImage: "",
    description: "",
  });

  useEffect(() => {
    setForm({
      title: initialData.title || "",
      author: initialData.author || "",
      category: initialData.category || "",
      price: initialData.price || "",
      coverImage: initialData.coverImage || "",
      description: initialData.description || "",
    });
  }, [initialData]);

  const handleChange = ({ target }) => {
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  return (
    <Card className="p-8">
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(form);
        }}
      >
        <Input
          label="Book Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <Input
          label="Author"
          name="author"
          value={form.author}
          onChange={handleChange}
        />

        <Select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={[
            { label: "Programming", value: "programming" },
            { label: "Business", value: "business" },
            { label: "Design", value: "design" },
          ]}
        />

        <Input
          label="Price"
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
        />

        <Input
          label="Cover Image URL"
          name="coverImage"
          value={form.coverImage}
          onChange={handleChange}
        />

        <TextArea
          label="Description"
          rows={5}
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <Button
          loading={loading}
          type="submit"
        >
          Save Book
        </Button>
      </form>
    </Card>
  );
}