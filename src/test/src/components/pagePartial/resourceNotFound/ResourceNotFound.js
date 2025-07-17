import React from "react";
import './style.css';

export const ResourceNotFound = (props) => {
    return (
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1>404</h1>
                </div>
                <h2 className='text-uppercase'>Oops! {props.title} not found</h2>
                <p>The {props.title} you are looking for might have been removed had its name changed or is temporarily unavailable. <a href="/">Return to homepage</a></p>
            </div>
        </div>
    )
}