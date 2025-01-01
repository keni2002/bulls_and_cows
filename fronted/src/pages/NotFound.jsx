import React from 'react';
import {Link} from "react-router-dom";

function NotFound() {
    return (
        <div className="container text-center mt-5">
            <div className="row">
                <div className="col">
                    <h1 className="display-1">404</h1>
                    <h2 className="mb-4">Page Not Found</h2>
                    <p className="lead">La página que buscas no se encuentra</p>
                    <Link to="/" className="btn btn-primary mb-3">Sácame de aquí</Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
