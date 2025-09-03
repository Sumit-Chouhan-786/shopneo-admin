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

const Page404 = lazy(() => import('../pages/404'))

function Layout() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext)
  let location = useLocation()

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
              {routes.map((route, i) => {
                return route.component ? (
                  <Route
                    key={i}
                    exact={true}
                    path={`/app${route.path}`}
                    render={(props) => <route.component {...props} />}
                  />
                ) : null
              })}
              <Redirect exact from="/app" to="/app/dashboard" />
                 {/* Put dynamic route BEFORE /app */}
        <Route path="/app/update-customer/:id" component={UpdateCustomer} />
        <Route path="/app/update-seller/:id" component={UpdateSeller} />
        // Route
<Route path="/app/all-customer-products/:customerId" component={AllCustomerProducts} />
<Route path="/app/all-customer-blogs/:customerId" component={AllCustomerBlogs} />
              <Route component={Page404} />
            </Switch>
          </Suspense>
        </Main>
      </div>
    </div>
  )
}

export default Layout
