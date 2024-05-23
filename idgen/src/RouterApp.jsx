import {createBrowserRouter, Link, Outlet, RouterProvider, useLocation} from 'react-router-dom';

import AppLayout from "/common/AppLayout";
import AppError from "/common/AppError";
import SequenceListPage from "./SequenceListPage";
import GuidePage from "./GuidePage";
import {App as AntApp, Layout, Menu} from 'antd';
import SequenceEdit from "./SequenceEdit.jsx";
import {getSequence, sequenceNewLoader} from "./loader.js";

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
                </AppLayout>),
            errorElement: <AppError/>,
            children: [
                {
                    path: "/",
                    element: <GuidePage/>,
                    errorElement: <AppError/>,
                },
                {
                    path: "/sequence/list",
                    element: <SequenceListPage/>,
                    errorElement: <AppError/>,
                },
                {
                    path: "/sequence/add",
                    element: <SequenceEdit/>,
                    errorElement: <AppError/>,
                    loader: sequenceNewLoader,
                },
                {
                    path: "/sequence/:name/update",
                    element: <SequenceEdit/>,
                    errorElement: <AppError/>,
                    loader: getSequence,
                },
            ],
        },
    ], {
        basename: "/idgen",
    });
    return router;
}

const {Content, Sider } = Layout;

const siderMenuItems = [
    {
        key: "group",
        type: "group",
        label: "Idgen Messenger",
        children: [
            {
                key: "/sequence/list",
                label: (<Link to="sequence/list">Sequence List</Link>),
            },
            {
                key: "/sequence/add",
                label: (<Link to="sequence/add">Add Sequence</Link>),
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
