export default function Avatar({
  src,
  name,
  size = 40,
}) {
  return (
    <img
      src={
        src ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}`
      }
      alt={name}
      className="rounded-full object-cover"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}