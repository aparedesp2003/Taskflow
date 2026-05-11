export type MemberRole = "owner" | "member";

export type ProjectMember = {
  id:        string;
  userId:    string;
  role:      MemberRole;
  fullName:  string | null;
  email:     string | null;
  avatarUrl: string | null;
  createdAt: string;
};
