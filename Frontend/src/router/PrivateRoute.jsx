import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";




export const PrivateRoute = ({ children }) => {

    const autenticate = useSelector(state => state.auth.isAutenticated);

    return (
        (autenticate)
            ? children
            : <Navigate to='/auth' />
    )
}