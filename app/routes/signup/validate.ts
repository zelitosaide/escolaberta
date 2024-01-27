export function validate(email: string, password: string) {
  const errors: { email?: string; password?: string} = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if(!email.includes("@")) {
    errors.email = "Please enter a valid email address."; 
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be 8 characters or more.";
  }
  return Object.keys(errors).length ? errors : null;
}