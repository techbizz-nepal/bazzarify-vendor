import Link from "next/link";

export default async function LoginActions() {
  return (
    <div className="flex flex-col space-y-4">
      <Link
        href="/register"
        className="text-secondary-foreground flex items-center justify-center"
      >
        <p>Doesn&apos;t have an account ?</p>
      </Link>
      <Link
        href="/reset-password"
        className="text-secondary-foreground flex items-center justify-center"
      >
        <p>Forgot Password ?</p>
      </Link>
    </div>
  );
}
