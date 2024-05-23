import React from 'react'
import {ConfigProvider, theme} from 'antd';
import 'antd/dist/reset.css';
import {SessionContextProvider} from "./Session.jsx";

export default function App({children}) {
    return (
        <React.StrictMode>
            <ConfigProvider
                theme={{
                    token: {
//                        colorPrimary: '#00b96b',
                        borderRadius: 2
                    },
                    algorithm: theme.defaultAlgorithm
                }}
            >
                <SessionContextProvider>
                    {children}
                </SessionContextProvider>
            </ConfigProvider>
        </React.StrictMode>
    );
}
