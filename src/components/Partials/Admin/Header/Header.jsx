import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
  return (
    // <nav className="p-2 border-b ml-0 md:ml-64 fixed top-0 right-0 left-0 bg-white duration-200 z-30 nav-header">
    //   <ul className="flex items-center">
    //     <li className="block md:hidden">
    //       <button type="button" className="text-xl" onClick={() => setShowSidebar(true)}>
    //         <i className="fa-regular fa-bars"></i>
    //       </button>
    //     </li>
    //     <li>
    //       <Link to="#">Home</Link>
    //     </li>
    //     <li>
    //       <Link to="#">Contact</Link>
    //     </li>
    //   </ul>
    // </nav>

    <header class="header bg-white shadow py-4 px-4">
      <div class="header-content flex items-center flex-row">
        
        <div class="flex ml-auto">
          <a href class="flex flex-row items-center">
            <img
              src="https://pbs.twimg.com/profile_images/378800000298815220/b567757616f720812125bfbac395ff54_normal.png"
              alt
              class="h-10 w-10 bg-gray-200 border rounded-full"
            />
            <span class="flex flex-col ml-2">
              <span class="truncate w-20 font-semibold tracking-wide leading-none">John Doe</span>
              <span class="truncate w-20 text-gray-500 text-xs leading-none mt-1">Manager</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
