const BASE_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("dsa-token") || ""}`,
});

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const signupUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export default BASE_URL;