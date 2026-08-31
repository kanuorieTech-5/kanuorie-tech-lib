import { Button, Card, Badge } from "../ui";

export default function PricingCard({
  title,
  price,
  duration = "/month",
  features = [],
  popular = false,
  buttonText = "Choose Plan",
  onSelect,
}) {
  return (
    <Card
      className={`relative p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        popular ? "border-2 border-primary" : ""
      }`}
    >
      {popular && (
        <Badge className="absolute right-5 top-5">Most Popular</Badge>
      )}

      <h3 className="text-2xl font-bold">{title}</h3>

      <div className="my-6">
        <span className="text-5xl font-bold">${price}</span>

        <span className="text-gray-500">{duration}</span>
      </div>

      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            ✅ {feature}
          </li>
        ))}
      </ul>

      <Button className="mt-8 w-full" onClick={onSelect}>
        {buttonText}
      </Button>
    </Card>
  );
}
