import React from "react";
import {Layout} from "antd";
import AppHeader from "./AppHeader";


export default function AppLayout({ children }) {
    return (
        <Layout>
            <AppHeader/>
            <Layout>
                {children}
            </Layout>
        </Layout>
    );
}