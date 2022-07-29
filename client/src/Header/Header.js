import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => (
    <div className="header-container">
        <Link to="/">Messages</Link>
        <Link to="/add">Write message</Link>
    </div>
);
