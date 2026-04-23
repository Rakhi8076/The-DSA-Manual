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

// ✅ SheetPage load hone pe — user ki saari solved IDs lao DB se
export const getUserProgress = async (userId: string): Promise<string[]> => {
  const res = await fetch(`${BASE_URL}/progress/${userId}`, {
    headers: authHeaders(),
  });
  const data = await handleResponse(res);
  return data.solvedIds; // ✅ ["striver-1.1-3", "MER-ARR-001", ...]
};

// ✅ User ne tick/untick kiya — DB mein save/delete karo
export const toggleProgress = async (data: {
  userId: string;
  questionId: string;
  sheetId: string;
}): Promise<boolean> => {
  const res = await fetch(`${BASE_URL}/progress/toggle`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  return result.solved; // ✅ true ya false
};

export default BASE_URL;