import { useEffect, useState } from "react";
import {
  Linkedin,
  Github,
  Twitter,
  Globe,
  Mail,
} from "lucide-react";

import { Loader, Card } from "../components/common";
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

        const response = await getTeamMembers();

        if (!mounted) return;

        /*
         * Supports common API response structures:
         *
         * 1. { success: true, data: [...] }
         * 2. { data: [...] }
         * 3. [...]
         */
        const members = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.team)
              ? response.data.team
              : Array.isArray(response?.team)
                ? response.team
                : [];

        setTeam(members);
      } catch (err) {
        console.error("Failed to load team:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load our team at the moment.",
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
      <section className="flex min-h-[50vh] items-center justify-center px-6 py-10">
        <Loader />
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Leadership and Team
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Meet the People Behind KanuorieTech
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            Meet the talented people behind KanuorieTech, working together to
            build meaningful digital solutions, innovative learning
            experiences, and technology that creates real impact.
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && team.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">
              Our team is coming soon
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-gray-600">
              We are currently updating our team information. Please check
              back soon to meet the people behind KanuorieTech.
            </p>
          </div>
        )}

        {team.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.map((member) => {
              const image =
                member.image ||
                member.avatar ||
                member.photo ||
                "/images/default-avatar.png";

              const name = member.name || "KanuorieTech Team Member";

              const position =
                member.position ||
                member.role ||
                member.title ||
                "Team Member";

              const bio = member.bio || member.description;

              const socialLinks = member.socialLinks || {};

              return (
                <Card
                  key={member._id || member.id}
                  className="group overflow-hidden rounded-3xl border border-gray-100 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
               
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={name}
                      loading="lazy"
                      className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(event) => {
                        if (
                          event.currentTarget.src.includes(
                            "/images/default-avatar.png",
                          )
                        ) {
                          return;
                        }

                        event.currentTarget.src =
                          "/images/default-avatar.png";
                      }}
                    />

                    {/* Featured Badge */}
                    {member.featured && (
                      <div className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                        Featured
                      </div>
                    )}

                    {/* Image Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      {name}
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-blue-600">
                      {position}
                    </p>

                    {bio && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                        {bio}
                      </p>
                    )}

                    {(socialLinks.linkedin ||
                      socialLinks.github ||
                      socialLinks.twitter ||
                      socialLinks.website ||
                      member.email) && (
                      <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
                        {socialLinks.linkedin && (
                          <a
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${name} LinkedIn`}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Linkedin size={18} />
                          </a>
                        )}

                        {socialLinks.github && (
                          <a
                            href={socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${name} GitHub`}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Github size={18} />
                          </a>
                        )}

                        {socialLinks.twitter && (
                          <a
                            href={socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${name} Twitter`}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-500"
                          >
                            <Twitter size={18} />
                          </a>
                        )}

                        {socialLinks.website && (
                          <a
                            href={socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${name} Website`}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Globe size={18} />
                          </a>
                        )}

                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            aria-label={`Email ${name}`}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Mail size={18} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}