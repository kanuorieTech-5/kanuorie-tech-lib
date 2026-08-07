import { Card, Avatar } from "../ui";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

export default function TeamCard({ member }) {
  return (
    <Card className="p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Avatar
        src={member.photo}
        alt={member.name}
        size="xl"
        className="mx-auto"
      />

      <h3 className="mt-5 text-xl font-semibold">
        {member.name}
      </h3>

      <p className="text-primary">
        {member.role}
      </p>

      <p className="mt-4 line-clamp-3 text-gray-500">
        {member.bio}
      </p>

      <div className="mt-6 flex justify-center gap-4">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        )}

        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
        )}

        {member.twitter && (
          <a
            href={member.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
        )}
      </div>
    </Card>
  );
}