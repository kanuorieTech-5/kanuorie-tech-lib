export default function SectionTitle({
  title,
  subtitle,
  center = false,
}) {
  return (
    <div
      className={`mb-10 ${
        center ? "text-center" : ""
      }`}
    >
      <h2 className="text-3xl font-bold text-yellow-300">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-gray-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}