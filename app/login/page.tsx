import LoginComponent from "./_components/LoginForm";

export default function LoginPage({
  searchParams: { redirectedFrom, query },
}: {
  searchParams: { redirectedFrom: string; query: string };
}) {
  return <LoginComponent redirectedFrom={redirectedFrom} query={query} />;
}
