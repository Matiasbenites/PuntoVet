import { useDispatch } from "react-redux";
import { authLogout } from "../../redux/slices/auth/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";




export const LogoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await dispatch(authLogout())
                localStorage.removeItem('user')
                navigate('/auth', { replace: true })
            } catch (error) {
                console.log(error)
            }
        }
        logout()
    }, [dispatch])


    return null

};