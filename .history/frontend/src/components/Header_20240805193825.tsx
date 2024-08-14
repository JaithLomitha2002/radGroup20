import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="bg-gradient-to-r from-indigo-700 to-rose-700 py-10">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">BookNinja.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
              <Link className="flex items-center text-white bg-gray-200 text-gray-800 text-lg px-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400" to="/my-bookings">
                My Bookings
              </Link>
              <Link className="flex items-center text-white px-3 font-bold hover:bg-rose-100 hover:text-black rounded-sm" to="/my-hotels">
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link to="/sign-in" className="flex bg-white items-center text-rose-600 px-3 font-bold hover:bg-gray-100 rounded-sm"> 
              Sign In
            </Link>
          )}
        </span>
        {/* //rounded-sm, lg, md, xl, 2xl, 3xl, full */}
      </div>
    </div>
  );
};

export default Header;
