import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
  return (
    <header className="header bg-white shadow py-4 px-4">
      <div className="header-content flex items-center flex-row">
        
        <div className="flex ml-auto">
          <a className="flex flex-row items-center">
            {/* <img
              src="https://pbs.twimg.com/profile_images/378800000298815220/b567757616f720812125bfbac395ff54_normal.png"
              className="h-10 w-10 bg-gray-200 border rounded-full"
            /> */}
            <span className="flex flex-col ml-2">
              <span className="truncate w-20 font-semibold tracking-wide leading-none">John Doe</span>
              <span className="truncate w-20 text-gray-500 text-xs leading-none mt-1">Manager</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
