export { default } from "next-auth/middleware";

export const config = { matcher: ["/root", "/dashboard:path*"] };
