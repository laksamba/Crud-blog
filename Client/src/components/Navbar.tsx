import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Navbar = ({ containerStyles, toggleMenu }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className={`${containerStyles} ${isSmallScreen ? 'small-screen' : ''}`}>
      <NavLink to={'/'} className={({ isActive }) => isActive ? 'active_link' : ''} onClick={isSmallScreen ? toggleMenu : null}>Home</NavLink>
      <NavLink to={'/crypto'} className={({ isActive }) => isActive ? 'active_link' : ''} onClick={isSmallScreen ? toggleMenu : null}>Crypto</NavLink>
      <NavLink to={'/Blog'} className={({ isActive }) => isActive ? 'active_link' : ''} onClick={isSmallScreen ? toggleMenu : null}>Blog</NavLink>
      <NavLink to={'/postblog'} className={({ isActive }) => isActive ? 'active_link' : ''} onClick={isSmallScreen ? toggleMenu : null}>PostBlog</NavLink>
    </nav>
  )
}

export default Navbar
