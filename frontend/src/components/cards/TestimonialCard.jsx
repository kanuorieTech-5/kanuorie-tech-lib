import { Card, Avatar } from "../ui";

export default function TestimonialCard({
  testimonial,
}) {
  return (
    <Card className="p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <Avatar
          src={testimonial.avatar}
          alt={testimonial.name}
        />

        <div>
          <h4 className="font-semibold">
            {testimonial.name}
          </h4>

          <p className="text-sm text-gray-500">
            {testimonial.position}
          </p>
        </div>
      </div>

      <p className="mt-6 italic leading-relaxed text-gray-600 dark:text-gray-300">
        "{testimonial.comment}"
      </p>

      <div className="mt-5 flex text-yellow-500">
        {"★".repeat(testimonial.rating)}
      </div>
    </Card>
  );
}