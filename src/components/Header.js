import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom' // <-- v5 hook
import { SidebarContext } from '../context/SidebarContext'
import { logout } from '../utils/Logout'
import {
  SearchIcon,
  MoonIcon,
  SunIcon,
  MenuIcon,
  OutlineLogoutIcon,
} from '../icons'
import { Avatar, Input, Dropdown, DropdownItem, WindmillContext } from '@windmill/react-ui'

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext)
  const { toggleSidebar } = useContext(SidebarContext)
  const history = useHistory() // <-- initialize useHistory

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  // Logout function using useHistory
  function handleLogout() {
    localStorage.removeItem('token') 
    history.push('/login')           
  }

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>

        {/* Search input */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Search for projects"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right side items */}
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Theme toggler */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === 'dark' ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>

          {/* Profile menu */}
          <li className="relative">
            <button
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={handleProfileClick}
              aria-label="Account"
              aria-haspopup="true"
            >
              <Avatar
                className="align-middle"
                src="https://image2url.com/images/1756707682296-285c39e2-0385-4339-85be-4ddc59af4e69.webp"
                alt="avatar"
                aria-hidden="true"
              />
            </button>

            <Dropdown
              align="right"
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
            >
              <DropdownItem onClick={logout}>
                <OutlineLogoutIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>Log out</span>
              </DropdownItem>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
