import { Card } from "../cards";

export default function WelcomeBanner({
  name,
}) {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">

      <h2 className="text-3xl font-bold">
        Welcome back, {name}
      </h2>

      <p className="mt-2 opacity-90">
        Here's what's happening across your platform today.
      </p>

    </Card>
  );
}