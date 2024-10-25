// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Ensure this CSS file contains styles for the footer section


function Footer({ isDarkMode }) {
    return (
        <footer className={`footer ${isDarkMode ? 'footer--dark' : ''}`}>
            <p className="footer__title">Mohit Shah</p>
            <div className="footer__social">
                <a href="https://www.facebook.com/?ref=tn_tnmn" className="footer__icon" target="_blank" rel="noopener noreferrer"><i className='bx bxl-facebook'></i></a>
                <a href="https://www.instagram.com/mohit__shahh/" className="footer__icon" target="_blank" rel="noopener noreferrer"><i className='bx bxl-instagram'></i></a>
                <a href="https://x.com/home" className="footer__icon" target="_blank" rel="noopener noreferrer"><i className='bx bxl-twitter'></i></a>
                <a href="https://www.linkedin.com/in/mohitshah7/" className="footer__icon" target="_blank" rel="noopener noreferrer"><i className='bx bxl-linkedin'></i></a>
            </div>
            <p className="footer__copy">&#169; caspermohit. All rights reserved</p>
        </footer>
    );
}

export default Footer;
