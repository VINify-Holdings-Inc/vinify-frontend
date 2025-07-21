import serviceHandler from '../core/services/serviceHandler';

export const TryLogInAction = async () => {
  let res = await serviceHandler.post('accounts/trysignin');
  return res;
};

export const SignInAction = async user => {
  let res = await serviceHandler.post('accounts/signin', JSON.stringify(user));
  return res;
};

export const SignUpAction = async user => {
  let res = await serviceHandler.post('accounts/signup', JSON.stringify(user));
  return res;
};

export const CompanySignUpAction = async company => {
  let res = await serviceHandler.post(
    'accounts/companysignup',
    JSON.stringify(company)
  );
  return res;
};

export const SignOutAction = async () => {
  let res = await serviceHandler.post('accounts/signout');
  return res;
};

export const ForgotPasswordAction = async email => {
  let res = await serviceHandler.post(
    `accounts/forgot-password?email=${email}`
  );
  return res;
};

export const ValidateResetPasswordTokenAction = async token => {
  let res = await serviceHandler.get(
    `accounts/validate-reset-password-token?token=${token}`
  );
  return res;
};

export const ResetPasswordAction = async password => {
  let res = await serviceHandler.put(
    'accounts/reset-password',
    JSON.stringify(password)
  );
  return res;
};

export const VerifyEmailAction = async token => {
  let res = await serviceHandler.put(`accounts/verify-email?token=${token}`);
  return res;
};

export const ChangePassword = async password => {
  let res = await serviceHandler.post(
    'accounts/changepassword',
    JSON.stringify(password)
  );
  return res;
};

export const UpdatePassword = async password => {
  let res = await serviceHandler.post(
    'accounts/password',
    JSON.stringify(password)
  );
  return res;
};

export const UpdateSecurity = async security => {
  let res = await serviceHandler.post(
    'accounts/security',
    JSON.stringify(security)
  );
  return res;
};

export const GetAdminDashboardTotalDataForKpi = async() => {

  let res = await serviceHandler.get(
    `Admin/GetDashboardData`
  ); 
 
  return res;
};

export const GetAdminDashboardAllUserData = async(page=1 ,limit=12,query) => {
 let url = `Admin/GetAllUserData?Page=${page}&size=${limit}` ; 
  if (query) {
    url += `&key=${query}`;
  } 
  let res = await serviceHandler.get(url); 
 
  return res;
};

export const GetAdminDashboardAllVedio = async (emailId) => {
  let url = 'Admin/GetAllVideos'; 
  if (emailId) {
    url += `?emailId=${emailId}`;
  } 
  const res = await serviceHandler.get(url);
  return res;
};
