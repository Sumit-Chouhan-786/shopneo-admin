import React, { useContext, Suspense, useEffect, lazy } from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import routes from '../routes'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Main from '../containers/Main'
import ThemedSuspense from '../components/ThemedSuspense'
import { SidebarContext } from '../context/SidebarContext'
import UpdateCustomer from '../components/common/UpdateCustomer'
import UpdateSeller from '../components/common/UpdateSeller'
import AllCustomerProducts from '../components/common/AllCustomerProducts'
import AllCustomerBlogs from '../components/common/AllCustomerBlogs'
import PrivateRoute from '../components/common/PrivateRoute'

const Page404 = lazy(() => import('../pages/404'))

function Layout() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext)
  const location = useLocation()

  // Check login status (replace with your auth logic, e.g., token in localStorage)
  const isAuthenticated = !!localStorage.getItem("token") 

  useEffect(() => {
    closeSidebar()
  }, [location])

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSidebarOpen && 'overflow-hidden'}`}
    >
      <Sidebar />

      <div className="flex flex-col flex-1 w-full">
        <Header />
        <Main>
          <Suspense fallback={<ThemedSuspense />}>
            <Switch>
              {/* Public routes if needed */}
              <Redirect exact from="/app" to="/app/dashboard" />

              {/* Protected routes */}
              {routes.map((route, i) => {
                return route.component ? (
                  <PrivateRoute
                    key={i}
                    exact
                    path={`/app${route.path}`}
                    component={route.component}
                    isAuthenticated={isAuthenticated}
                  />
                ) : null
              })}

              {/* Dynamic protected routes */}
              <PrivateRoute
                path="/app/update-customer/:id"
                component={UpdateCustomer}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                path="/app/update-seller/:id"
                component={UpdateSeller}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                path="/app/all-customer-products/:customerId"
                component={AllCustomerProducts}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                path="/app/all-customer-blogs/:customerId"
                component={AllCustomerBlogs}
                isAuthenticated={isAuthenticated}
              />

              <Route component={Page404} />
            </Switch>
          </Suspense>
        </Main>
      </div>
    </div>
  )
}

export default Layout
