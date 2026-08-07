import toast from "react-hot-toast";

import {
  Card,
} from "../components/common";

import {
  useTheme,
} from "../context";

export default function Settings() {

  const {
    darkMode,
    toggleDarkMode,
  } = useTheme();

  const handleToggle = () => {
    toggleDarkMode();
    toast.success("Settings updated.");
  };

  return (

    <section className="mx-auto max-w-4xl px-6 py-20">

      <Card className="p-8">

        <h1 className="mb-8 text-4xl font-bold">
          Settings
        </h1>

        <div className="flex items-center justify-between">

          <span className="text-lg">
            Dark Mode
          </span>

          <input
            type="checkbox"
            checked={darkMode}
            onChange={handleToggle}
          />

        </div>

      </Card>

    </section>

  );

}