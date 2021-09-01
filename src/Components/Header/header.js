import React from 'react'
import './style.css'

function Header() {
    return (
        <header className='header'>
            <ul className='header__list'>
                <li className='list__item'>
                    <i className="fa fa-bars" />
                </li>
                <li className='list__item'>
                    <i className="fa fa-home"></i>
                </li>
                <li className='list__item'>
                    <i className="fa fa-table"></i>
                    Bảng
                </li>
                <li className='list__item'>
                    <input type='text' placeholder='Chuyển đến...' />
                    <i className="fa fa-search"></i>
                </li>
            </ul>
            <div className='header__logo'>
                <a href='#'>Trello</a>
            </div>
            <ul className='header__list'>
                <li className='list__item'>
                    <i className="fa fa-plus"></i>
                </li>
                <li className='list__item'>
                    <i className="fa fa-info-circle"></i>
                </li>
                <li className='list__item'>
                    <i className="fa fa-bell"></i>
                </li>
                <li className='list__item'>
                    <div className='item__profile'>T</div>
                </li>
            </ul>
        </header>
    )
}

export default Header