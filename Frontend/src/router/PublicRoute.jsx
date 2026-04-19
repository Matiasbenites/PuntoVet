import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";




export const PublicRoute = ({ children }) => {

    const autenticate = useSelector(state => state.auth.isAutenticated);

    return (
        (!autenticate)
            ? children
            : <Navigate to='/productos' />
    )
}