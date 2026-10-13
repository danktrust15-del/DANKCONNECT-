const CLOUD_NAME = "aqx4n0dz";
const PRESET = "dank_profile";

export const uploadToCloudinary = async (uri) => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: `profile_${Date.now()}.jpg`,
  });
  formData.append("upload_preset", PRESET);
  formData.append("folder", "dank-empire/profiles");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    console.log("Cloudinary response:", data.secure_url);
    return data.secure_url || null;
  } catch (e) {
    console.log("Upload failed:", e);
    return null;
  }
};
