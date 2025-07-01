export const Logout = () => {
  localStorage.removeItem("jwtToken");  // remove token.
  window.location.href = "/login";      // redirect to login page.
};