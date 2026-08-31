export default function Progress({ value }) {
  return (
    <div className="h-3 w-full rounded-full bg-gray-200">
      <div
        className="h-3 rounded-full bg-blue-600 transition-all"
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}
