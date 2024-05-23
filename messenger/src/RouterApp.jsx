import {createBrowserRouter, Link, Outlet, RouterProvider, useLocation} from 'react-router-dom';
import {App as AntApp, Layout, Menu} from 'antd';
import AppLayout from "/common/AppLayout";
import AppError from "/common/AppError";
import HomePage from "./HomePage";
import CreativeList from "./CreativeList.jsx";
import CreativeEdit from "./CreativeEdit.jsx";
import {
    creativeDetailLoader,
    creativeNewLoader,
} from "./loader.js";
import ConsoleMessageView from "./ConsoleMessageView.jsx";

let router = null;
function getRouter() {
    if (router) {
        return router;
    }
    router = createBrowserRouter([
        {
            path: "/",
            element: (
                <AppLayout>
                    <AppContent/>
                </AppLayout>
            ),
            errorElement: <AppError/>,
            children: [
                {
                    path: "/",
                    element: <HomePage/>,
                    errorElement: <AppError/>,
                },
                {
                    path: "/creative/list",
                    element: <CreativeList/>,
                    errorElement: <AppError/>,
                },
                {
                    path: "/creative/add",
                    element: <CreativeEdit/>,
                    errorElement: <AppError/>,
                    loader: creativeNewLoader,
                },
                {
                    path: "/creative/:creativeId/update",
                    element: <CreativeEdit/>,
                    errorElement: <AppError/>,
                    loader: creativeDetailLoader,
                },
                {
                    path: "/console-messages",
                    element: <ConsoleMessageView/>,
                    errorElement: <AppError/>,
                }
            ],
        },
    ], {
        basename: "/messenger",
    });
    return router;
}

const {Content, Sider } = Layout;

const siderMenuItems = [
    {
        key: "group",
        type: "group",
        label: "Ikeyit Messenger",
        children: [
            {
                key: "/creative/list",
                label: (<Link to="creative/list">Creative List</Link>),
            },
            {
                key: "/creative/add?channel=sms",
                label: (<Link to="creative/add?channel=sms">Add SMS Creative</Link>),
            },
            {
                key: "/creative/add?channel=email",
                label: (<Link to="creative/add?channel=email">Add Email Creative</Link>),
            },
            {
                key: "/creative/add?channel=console",
                label: (<Link to="creative/add?channel=console">Add Console Creative</Link>),
            },
            {
                key: "/console-messages",
                label: (<Link to="/console-messages">Console messages</Link>),
            }
        ]
    },
]

export default function RouterApp() {
    return <AntApp><RouterProvider router={getRouter()} /></AntApp>;
}

function AppContent() {
    const location = useLocation();
    const defaultSelectedKeys = [location.pathname + location.search];
    return (
        <>
            <Sider
                collapsible={true}
                theme="light"
            >
                <Menu
                    mode="inline"
                    defaultSelectedKeys={defaultSelectedKeys}
                    style={{
                        height: '100%',
                        borderRight: 0,
                    }}
                    items={siderMenuItems}
                />
            </Sider>
            <Layout>
                <Content
                    style={{
                        padding:  20,
                        background: "#fff"
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </>
    );
}
