import Card from "./Card";

export default function StatCard({
  title,
  description,
  icon: Icon,
}) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        
        {Icon && (
          <div
            className="rounded-xl p-4 text-white bg-"
            >
            <Icon size={28} />
          </div>
        )}
        
        <p className="text-white py-4">
          {title}
        </p>
      </div>
       <h2 className="mt-2 text-sm text-white font-bold">
          {description}
        </h2> 
    </Card>
  );
}