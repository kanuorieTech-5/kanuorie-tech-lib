import { useEffect, useState } from "react";

import {
  Loader,
  Card,
} from "../components/common";

import { getTeamMembers } from "../services";

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadTeam = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getTeamMembers();

        if (!mounted) return;

        setTeam(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load team:", err);

        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load our team at the moment."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTeam();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center px-6 py-20">
        <Loader />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      {/* Header */}
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
          Our Team
        </p>

        <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Meet Our Team
        </h1>

        <p className="text-lg leading-8 text-gray-600">
          Meet the talented people behind KanuorieTech, working together
          to build meaningful digital solutions and deliver great
          experiences.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-auto mb-10 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!error && team.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <h2 className="mb-2 text-2xl font-semibold">
            Our team is coming soon
          </h2>

          <p className="text-gray-600">
            We are currently updating our team information.
          </p>
        </div>
      )}

      {/* Team Grid */}
      {team.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {team.map((member) => (
            <Card
              key={member._id}
              className="group overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={
                    member.image ||
                    "/images/default-avatar.png"
                  }
                  alt={member.name || "Team member"}
                  loading="lazy"
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/default-avatar.png";
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold">
                  {member.name}
                </h2>

                {member.position && (
                  <p className="mt-1 text-sm font-medium text-blue-600">
                    {member.position}
                  </p>
                )}

                {member.bio && (
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                    {member.bio}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}