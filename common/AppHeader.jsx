import {useContext} from "react";
import {SessionContext} from "./Session";
import {Button, Space, Layout, theme} from 'antd';
const { useToken } = theme;
export default function AppHeader() {
    const {auth, logout} = useContext(SessionContext);
    const { token } = useToken();
    return (
        <Layout.Header style={{
            backgroundColor: token.colorBgContainer,
            borderColor: token.colorBorder,
            borderWidth: token.lineWidth,
            display: "flex"
            }}>
            <div style={{
                fontSize:token.fontSizeXL,
                display: "flex",
                minWidth: "10em"
                }}>
                <a href="/">IKEYIT M</a>
            </div>
            <div style={{
                display: "flex",
                flex: "1 1"
                }}>

            </div>
            <div style={{
                justifyContent:"flex-end",
                display: "flex",
                minWidth: "20em"
                }}>
                <Space>
                    <div>{auth.user?.username}</div>
                    <Button type="link" onClick={logout}>Logout</Button>
                </Space>
            </div>
        </Layout.Header>
    );
}
