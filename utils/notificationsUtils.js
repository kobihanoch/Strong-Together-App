import { Image } from "react-native";
// Cache all profile images for faster display and build an image map
export const cacheProfileImagesAndGetMap = async (allSendersUsersArr) => {
  const imageMap = {};
  const promises = [];
  allSendersUsersArr.forEach((sender) => {
    if (sender.sender_profile_image_url) {
      // Prefetching
      promises.push(
        Image.prefetch(
          `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${sender.sender_profile_image_url}`
        ).catch(() => {})
      );
      // Mapping
      imageMap[sender.sender_id] = {
        uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${sender.sender_profile_image_url}`,
      };
    } else {
      if (sender.sender_gender == "Male") {
        imageMap[sender.sender_id] = require("../assets/man.png");
      } else {
        imageMap[sender.sender_id] = require("../assets/woman.png");
      }
    }
  });
  await Promise.all(promises);
  return imageMap;
};
