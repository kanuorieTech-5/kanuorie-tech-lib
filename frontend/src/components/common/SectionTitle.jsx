export default function SectionTitle({
  title,
  subtitle,
  Badge,
  center = false,
  light = false,
}) {
  return (
    <div
      className={`mb-10 ${
        center ? "text-center" : ""
      }`}
    >
      {Badge && (
        <p
          className={`mb-3 text-sm font-semibold uppercase tracking-wider ${
            light
              ? "text-blue-300"
              : "text-blue-600"
          }`}
        >
          {Badge}
        </p>
      )}

      <h2
        className={`text-3xl font-bold ${
          light
            ? "text-white"
            : "text-gray-300"
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-3 ${
            light
              ? "text-gray-300"
              : "text-gray-400"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}