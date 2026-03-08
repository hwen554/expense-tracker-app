export const getProfileImage = (file: any) => {
  if (file && typeof file === "string") return true;
  if (file && typeof file === "object") return file.uri;

  return require("../assets/images/defaultAvatar.png");
};
