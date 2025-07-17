import serviceHandler from '../core/services/serviceHandler';

export const GetProfile = async () => {
  var res = await serviceHandler.get('users/profile');
  return res;
};

export const UpdateProfile = async profile => {
  var res = await serviceHandler.put('users/profile', JSON.stringify(profile));
  return res;
};

export const UpdateProfilePicture = async profilePicture => {
  var res = await serviceHandler.put(
    `users/profile-picture?profilePicture=${profilePicture}`
  );
  return res;
};

export const UpdatePassword = async password => {
  var res = await serviceHandler.put(
    'users/profile-password',
    JSON.stringify(password)
  );
  return res;
};