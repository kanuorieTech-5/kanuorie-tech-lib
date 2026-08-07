import { useEffect, useState } from "react";

import {
  Loader,
  Card,
} from "../components/common";

import { getTeamMembers } from "../services";

export default function Team() {

  const [team, setTeam] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadTeam = async () => {

      try {

        const res = await getTeamMembers();

        setTeam(res.data || []);

      } finally {

        setLoading(false);

      }

    };

    loadTeam();

  }, []);

  if (loading) return <Loader />;

  return (

    <section className="mx-auto max-w-7xl px-6 py-20">

      <h1 className="mb-12 text-center text-5xl font-bold">

        Meet Our Team

      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        {team.map(member => (

          <Card key={member._id}>

            <img
              src={member.image}
              alt={member.name}
              className="mb-5 h-64 w-full rounded-xl object-cover"
            />

            <h2 className="text-xl font-bold">

              {member.name}

            </h2>

            <p className="text-gray-500">

              {member.position}

            </p>

          </Card>

        ))}

      </div>

    </section>

  );

}