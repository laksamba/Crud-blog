import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

const UseAutoLogin = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const autoLoginApiCall = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/refresh`, {
          withCredentials: true,
        });

        if (response.data && response.data.user) {
          const user = {
            _id: response.data.user._id,
            email: response.data.user.email,
            username: response.data.user.username,
            auth: response.data.auth,
          };

          dispatch(setUser(user));
        }
      } catch (error) {
        console.error("Auto-login failed", error);
      } finally {
        setLoading(false);
      }
    };

    autoLoginApiCall();
  }, [dispatch]);

  return loading;
};

export default UseAutoLogin;
