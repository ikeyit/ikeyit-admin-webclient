import React from "react";
import {useRouteError} from "react-router-dom";

export default function AppError() {
    const error = useRouteError();
    return (
        <div className="k-error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}
