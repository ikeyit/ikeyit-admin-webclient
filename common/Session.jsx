import {createContext, useEffect, useState} from "react";
import {ajax, setUnauthorizedCallback} from "./ajax";
import {Alert, Button, Spin} from "antd";

export const SessionContext = createContext(null);

const SSO_AUTHORIZED_PATH = '/login/oauth2/authorization/keycloak?redirect=';
const LOGOUT_URL = '/logout';

export function SessionContextProvider({children}) {
    const [auth, setAuth] = useState({
        status: "loading"
    });
    useEffect(() => {
        setUnauthorizedCallback(onUnauthorized);
        ajax.get("/operator/profile")
            .then(user => {
                setAuth(prev => {
                    return {
                        ...prev,
                        status: "success",
                        user
                    }});
            }, error => {
                if (error.errCode !== 401) {
                    setAuth(prev => {
                        return {
                            ...prev,
                            status: "error",
                            error,
                            user: null
                        }});
                }
            });
        return () => {setUnauthorizedCallback(null)}
    }, []);


    function onUnauthorized() {
        setAuth(prev => {
            return {
                ...prev,
                status: "needLogin",
                user: null
            }
        });
    }

    function login() {
        location.href = location.origin + SSO_AUTHORIZED_PATH + encodeURIComponent(location.href);
    }

    function logout() {
        location.href = LOGOUT_URL;
        setAuth(prev => {
            return {
                ...prev,
                status: "needLogin",
                user: null
            }});
    }
    return (
        <SessionContext.Provider
            value={{
                auth,
                logout
            }}
        >
            {auth.status === "error" &&
                <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Alert message={auth.error.errMsg} type="error" showIcon />
                </div>
            }
            {auth.status === "success" && children}
            {auth.status === "loading" &&
                <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Spin size="large"/>
                </div>
            }
            {auth.status === "needLogin" &&
                <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button type="primary" onClick={login}>Login</Button>
                </div>
            }
        </SessionContext.Provider>
    );
}