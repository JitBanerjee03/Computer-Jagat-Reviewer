import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { contextProviderDeclare } from "../store/ContextProvider";

const LoggedHeader=()=>{
  const [activeLink, setActiveLink] = useState('About');
  const navigate=useNavigate();

  const getContextProvider=useContext(contextProviderDeclare);
  const {setLoggedIn,isloggedIn}=getContextProvider;

  const handleLinkClick = (label) => {
    setActiveLink(label);
  };
  const handleLogOut=()=>{
    localStorage.removeItem('jwtToken'); // Clear current domain token (5178)

    const portals = [
      'https://computer-jagat-author.vercel.app',
      'https://computer-jagat-reviewer.vercel.app',
      'https://computer-jagat-associate-editor.vercel.app',
      'https://computer-jagat-area-editor.vercel.app',
      'https://computer-jagat-chief-editor.vercel.app'
    ];

    // Inject hidden iframes to trigger logout on each portal
    portals.forEach((portal) => {
      const iframe = document.createElement('iframe');
      iframe.src = `${portal}?logout=true&timestamp=${Date.now()}`; // Add timestamp to avoid caching
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    });

    // Allow iframes to execute logout code, then redirect
    setTimeout(() => {
      window.location.href = 'https://journal-management-system-frontend.vercel.app/login';
    }, 1500);
  }

  return (
    <div style={{ marginLeft: '8%', marginRight: '8%' }}>
      <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <Link
          to="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          {/* Replace this with a logo or text as needed */}
          <img src="/logo.png" alt="Logo" width="40" height="40" className="me-2"/>
          <span className="fs-4">Journal Management System</span>
        </Link>

        <ul className='nav nav-pills'>
          
          <li className='nav-item'>
            <Link to={'/'} className={`nav-link ${activeLink === 'About' ? 'active' : ''}`} onClick={() => handleLinkClick('About')}>About</Link>
          </li>

          <li className='nav-item'>
            <Link to={'/account'} className={`nav-link ${activeLink === 'Account' ? 'active' : ''}`} onClick={() => handleLinkClick('Account')}>Account</Link>
          </li>
          
          <li className='nav-item'>
            <Link to={'/assigned-journals'} className={`nav-link ${activeLink === 'Assigned Journals' ? 'active' : ''}`} onClick={() => handleLinkClick('Assigned Journals')}>Assigned Journals</Link>
          </li>

        </ul>
        <button type="button" className="btn btn-outline-warning" style={{marginLeft:'2%'}}
          onClick={handleLogOut}
        >Log Out</button>
      </header>
    </div>
  );
}

export default LoggedHeader;