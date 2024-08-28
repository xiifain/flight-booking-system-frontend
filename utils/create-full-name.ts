export function createFullName(profile: {
  firstName: string;
  lastName?: string;
}) {
  return profile.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : profile.firstName;
}

export function createAvatarName(profile: {
  firstName: string;
  lastName?: string;
}) {
  return profile.firstName[0] + (profile.lastName ? profile.lastName[0] : "");
}
