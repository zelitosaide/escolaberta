import { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";

export function meta() {
  return [
    { title: "escolaberta | Signup" }
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData));
  return null;
}

export default function Signup() {
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
        </div>
        <button type="submit">Signup</button>
      </Form>
    </div>
  );
}