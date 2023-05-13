export const meta = {
  title: "Logged Out",
};

export default function LoggedOut() {
  return (
    <>
      <h1>Logged Out</h1>

      <p>
        <a href="/login">&rarr; Log In</a>
      </p>
      <p>
        <a href="/signup">&rarr; Sign Up</a>
      </p>
    </>
  );
}
