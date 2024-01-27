import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { validate } from "./validate";

export function meta() {
  return [
    { title: "escolaberta | Signup" }
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const errors = validate(email, password);
  return { errors };
}

export default function Signup() {
  const actionData = useActionData<typeof action>();
  const emailError = actionData?.errors?.email
  const passwordError = actionData?.errors?.password;

  return (
    <div>
      <h1>Sign up</h1>
      <Form method="post" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label htmlFor="email">Email address</label>
          <input 
            id="email"
            autoFocus
            type="email"
            name="email"  
            autoComplete="email"
            required
            placeholder="Email address"
            style={{ width: "100%" }}
          />
          {emailError && (
            <p style={{ padding: 0, margin: 0, color: "red" }}>{emailError}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            placeholder="Password"
            autoComplete="current-password"
            required
            aria-describedby="password-error"
            style={{ width: "100%" }}
          />
          {passwordError && (
            <p style={{ padding: 0, margin: 0, color: "red" }}>{passwordError}</p>
          )}
        </div>
        <button type="submit">Signup</button>
      </Form>
    </div>
  );
}