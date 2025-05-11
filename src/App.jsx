import { HashRouter, Routes, Route } from 'react-router-dom'
import Menu from './components/Menu'
import { AuthProvider, AuthRoute } from './context/Auth'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import BlogPost from './post/BlogPost'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import LogoutPage from './pages/LogoutPage'
import UserPost from './post/UserPost'

function App() {

  return (
    <>
      <HashRouter>
        <AuthProvider>
          <Menu />
          <Routes>
            <Route path='/' element={ <HomePage /> } />
            <Route path='/blog' element={ <BlogPage /> }>
              <Route path=':slug' element={ <BlogPost /> } />
            </Route>
            <Route 
              path='/profile' 
              element={ 
                <AuthRoute>
                  <ProfilePage />
                </AuthRoute>
              } 
            >
              <Route path=':slug' element={ <UserPost /> } />
            </Route>
            <Route path='/login' element={ <LoginPage /> } />
            <Route 
              path='/logout' 
              element={ 
                <AuthRoute>
                  <LogoutPage /> 
                </AuthRoute>
              } 
            />
            <Route path='*' element={ <p>Not Found</p> } />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </>
  )
}

export default App
