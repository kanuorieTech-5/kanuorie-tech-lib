import { useState } from "react";
import { Button, Card, Select, TextArea } from "../ui";

export default function BookReviewForm({ loading = false, onSubmit }) {
  const [review, setReview] = useState({
    rating: "5",
    comment: "",
  });

  const change = ({ target }) =>
    setReview((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));

  return (
    <Card className="p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(review);
        }}
        className="space-y-5"
      >
        <Select
          label="Rating"
          name="rating"
          value={review.rating}
          onChange={change}
          options={[
            { label: "★★★★★", value: "5" },
            { label: "★★★★☆", value: "4" },
            { label: "★★★☆☆", value: "3" },
            { label: "★★☆☆☆", value: "2" },
            { label: "★☆☆☆☆", value: "1" },
          ]}
        />

        <TextArea
          label="Review"
          rows={5}
          name="comment"
          value={review.comment}
          onChange={change}
        />

        <Button loading={loading} type="submit">
          Submit Review
        </Button>
      </form>
    </Card>
  );
}
