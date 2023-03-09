import "./styles.css";

const Login = (props: any) => {
  const { googleSignIn } = props;

  return (
    <div className="loginContainer">
      <div className="loginElementsContainer">
        <h2 className="loginTitle">Please Login First</h2>
        <button className="signInButton" onClick={googleSignIn}>
          Google SignIn
        </button>
      </div>
    </div>
  );
};

export default Login;
