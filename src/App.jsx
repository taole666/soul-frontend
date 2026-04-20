import './App.css'
import { useState, useEffect } from 'react'
import { NavLink, Routes, Route } from 'react-router-dom'
import logo from './assets/frontend_logo.png'
import defaultAvatar from './assets/default-avatar.png'
import Home from './pages/Home'
import Match from './pages/Match'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import messages from './i18n/messages'

function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'zh'
  })

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('loginUser')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const text = messages[lang]

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const handleLogout = () => {
    localStorage.removeItem('loginUser')
    setUser(null)
  }

  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo-title">
          <img src={logo} alt="logo" className="logo-img" />
          <h2>SOUL</h2>
        </div>

        <div className="nav-right">
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
            <option value="ko">한국어</option>
            <option value="ja">日本語</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
            <option value="ar">العربية</option>
          </select>

          <div className="nav-links">
            <NavLink to="/">{text.home}</NavLink>
            <NavLink to="/match">{text.match}</NavLink>
            <NavLink to="/chat">{text.chat}</NavLink>
          </div>

          {user ? (
            <div className="user-box">
              <NavLink to="/profile" className="profile-link">
                <img
                  src={user.avatar && user.avatar.trim() ? user.avatar : defaultAvatar}
                  alt="avatar"
                  className="user-avatar"
                  onError={(e) => {
                    e.target.src = defaultAvatar
                  }}
                />
              </NavLink>

              <NavLink to="/profile" className="profile-link username-link">
                {user.username}
              </NavLink>

              <button className="logout-btn" onClick={handleLogout}>
                {text.logout}
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <NavLink to="/login">{text.login}</NavLink>
            </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home text={text} />} />
        <Route path="/match" element={<Match text={text} />} />
        <Route path="/chat" element={<Chat text={text} />} />
        <Route path="/login" element={<Login text={text} setUser={setUser} />} />
        <Route path="/register" element={<Register text={text} />} />
        <Route
          path="/profile"
          element={<Profile text={text} user={user} setUser={setUser} />}
        />
      </Routes>
    </div>
  )
}

export default App