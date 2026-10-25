export function normalizeTeamMembers(response) {
  const candidates = [
    response?.data?.data,
    response?.data,
    response,
  ];

  let members = [];

  for (const payload of candidates) {
    if (Array.isArray(payload)) {
      members = payload;
      break;
    }

    if (Array.isArray(payload?.items)) {
      members = payload.items;
      break;
    }

    if (Array.isArray(payload?.team)) {
      members = payload.team;
      break;
    }

    if (Array.isArray(payload?.members)) {
      members = payload.members;
      break;
    }
  }

  return members
    .filter((member) => member && member.active !== false)
    .map((member) => ({
      ...member,
      name:
        member.name ||
        member.fullName ||
        [member.firstName, member.lastName]
          .filter(Boolean)
          .join(" ") ||
        "KanuorieTech Team Member",
    }));
}
