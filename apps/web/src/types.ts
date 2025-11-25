export type Role = "user" | "ai";
export type Message = {
  id: string;
  role: Role;
  text: string;
  status?: "generating" | "error" | "done";
};
