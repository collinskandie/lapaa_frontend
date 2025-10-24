import React from 'react'
import { useSelector } from 'react-redux';
import YouthRegistration from '../index';

const PublicRegistration = () => {
    const theme = useSelector(state => state.theme.currentTheme)
    return (
        <div className={`h-100 ${theme === 'light' ? 'bg-white' : ''}`}>
            <div className="container-fluid d-flex flex-column justify-content-between h-100 px-md-4 pb-md-4 pt-md-1">
                <div>
                    <img className="img-fluid" src={`/img/${theme === 'light' ? 'logo.png' : 'logo-white.png'}`} alt="" />
                </div>
                <div className="container">
                    <YouthRegistration />  </div>

            </div>
        </div>
    )
}

export default PublicRegistration
