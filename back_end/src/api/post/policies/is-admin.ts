/**
 * is-admin policy
 */

export default (policyContext, config, { strapi }) => {
  const role = policyContext.state?.user?.role?.name; //Authenticated
  if (role === config?.userRole) {
    return true;
  }

  return false;
};
