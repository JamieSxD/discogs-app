const supabase = require('../config/supabase');

class UserService {
  // Upload user avatar
  static async uploadAvatar(file, userId) {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true // Replace existing avatar
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return {
      path: data.path,
      url: urlData.publicUrl
    };
  }

  // Delete user avatar
  static async deleteAvatar(userId) {
    const { data, error } = await supabase.storage
      .from('avatars')
      .remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.jpeg`]);

    return { data, error };
  }

  // Get avatar URL
  static getAvatarUrl(userId, fileName = 'avatar.jpg') {
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${userId}/${fileName}`);

    return data.publicUrl;
  }
}

module.exports = UserService;