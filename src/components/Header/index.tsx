import { useEffect, useState } from "react";
import "./styles.css";
import { User } from "firebase/auth";
interface HeaderProps {
  googleSignIn: () => void;
  signOut: () => void;
  loading: boolean;
  user: User | null | undefined;
  isUserDataLoading: boolean;
}

const Header = (props: HeaderProps) => {
  const { googleSignIn, signOut, loading, user, isUserDataLoading } = props;

  // THEMING WITH CSS VARIABLES
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const handlerClickThemeChange = () => {
    if (document.documentElement.getAttribute("theme") === "dark") {
      document.documentElement.setAttribute("theme", "light");
      setIsDarkTheme(false);
    } else {
      document.documentElement.setAttribute("theme", "dark");
      setIsDarkTheme(true);
    }
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("theme", "dark");
      setIsDarkTheme(true);
    }
  }, []);

  return (
    <nav className="headerNav">
      <button className="themeButton" onClick={handlerClickThemeChange}>
        {isDarkTheme ? "🌒" : "🌔"}
      </button>
      <h1 className="headerTitle">Expense Manager</h1>
      {loading ? (
        <span className="emptyHeaderSpan"></span>
      ) : !user ? (
        <button className="signInHeaderButton" onClick={googleSignIn}>
          Google SignIn
        </button>
      ) : (
        <div className="userDataContainer">
          {isUserDataLoading ? null : (
            <>
              <button className="signOutButton" onClick={signOut}>
                X
              </button>
              <img
                className="userAvatar"
                src={user.photoURL as string}
                alt={user.displayName as string}
                width={50}
              />
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
