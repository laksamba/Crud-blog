import Navbar from "./Navbar";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/Logo.png";
import { useState } from "react";
import { CgClose, CgMenuRight } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../Api/internal";
import { resetUser } from "../store/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.auth);
  const [menuOpened, setMenuOpened] = useState(false);
  const toggleMenu = () => setMenuOpened(!menuOpened);

  const handleLogout = async () => {
    await signout();
    dispatch(resetUser());
  };

  return (
    <div className="fixed top-2 left-0 m-auto max_padd_container w-full">
      <div className="max-container px-4 flexBetween py-3 shadow-lg bg-white rounded-full ring-1 ring-slate-900/5 mb-24 max-xs:py-2">
        {/* logo */}
        <div>
          <Link to={"/"}>
            <img src={logo} alt="logo" className="h-10" />
          </Link>
        </div>
        {/* navbar */}
        <Navbar
          containerStyles={`${
            menuOpened
              ? "flexCenter flex-col gap-y-8 justify-center fixed top-24 p-12 bg-white rounded-3xl transition-all duration-500 shadow-md right-0 w-full medium-16"
              : " hidden md:flex gap-x-6 text-gray-600 xl:gap-20 medium-16"
          }`}
          toggleMenu={toggleMenu}
        />

        {/* button */}
        <div className="flexBetween gap-2 bold-16">
          {!menuOpened ? (
            <CgMenuRight
              className="md:hidden inline-block cursor-pointer regular-24 hover:text-blue-400 mr-2 "
              onClick={toggleMenu}
            />
          ) : (
            <CgClose
              className="md:hidden inline-block cursor-pointer regular-24 hover:text-blue-400 mr-2 "
              onClick={toggleMenu}
            />
          )}

          {isAuthenticated ? (
            <div className="flexBetween gap-x-2">
              <button onClick={handleLogout} className="btn_red_rounded !py-3">
                Log Out
              </button>
            </div>
          ) : (
            <div className="flexBetween gap-x-1">
              <NavLink
                to={"/login"}
                className={"btn_rounded flexCenter gap-x-1 w-28 !py-3"}
                onClick={handleLogout}
              >
                Log In
              </NavLink>
              <NavLink to={"/signup"} className={"btn_secondary_rounded !py-3"}>
                Sign up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
