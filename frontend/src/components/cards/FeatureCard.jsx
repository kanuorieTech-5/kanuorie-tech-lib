import { Card } from "../ui";

export default function FeatureCard({ icon, title, description }) {
  return (
    <Card className="group p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-4xl text-primary transition group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mb-3 text-xl font-semibold">{title}</h3>

      <p className="leading-relaxed text-gray-500 dark:text-gray-300">
        {description}
      </p>
    </Card>
  );
}
