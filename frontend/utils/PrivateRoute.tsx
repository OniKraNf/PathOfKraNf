import { useContext } from 'react';
import { useRouter } from "next/router";
import AuthContext from '../context/AuthContext';
import Dashboard from '../components/Dashboard';

const PrivateRoute = ({children, ...rest}: any) => {
    const router = useRouter();
    let { user } = useContext(AuthContext);

    if (!user) {
        router.push('/login');
        return null;
    }

    return <Dashboard/>;
}

export default PrivateRoute;