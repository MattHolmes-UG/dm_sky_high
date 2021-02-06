const demoUser = {
  usr: 'demo',
  psw: 'demo'
};

const authenticate = (username, password) => {
  return (username===demoUser.usr && password===demoUser.psw);
};

const userAuth = {
  isAuthenticated: !!sessionStorage.getItem("loggedIn"),
  signIn: () => {
    sessionStorage.setItem("loggedIn", true);
    userAuth.isAuthenticated = true;
    return userAuth.isAuthenticated;
  },
  signOut: () => {
    sessionStorage.removeItem("loggedIn");
    userAuth.isAuthenticated = false;
    return userAuth.isAuthenticated;
  }, authenticate
};

export {userAuth };