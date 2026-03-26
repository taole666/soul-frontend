import './App.css'
import { NavLink, Routes, Route } from 'react-router-dom'
import logo from './assets/frontend_logo.png'; // logo 路径

function App() {
  return (
    <div className="container">

      {/* 顶部导航 / Navigation Bar */}
      <nav className="navbar">
        {/* 左侧：logo + 名字 */}
        <div className="navbar-left">
          <img src={logo} alt="SOUL Logo" className="logo-img" />
          <span className="logo-text">SOUL</span>
        </div>

        {/* 右侧：导航 + 多语言按钮 */}
        <div className="navbar-right">
          <NavLink to="/">首页 Home</NavLink>
          <NavLink to="/match">匹配 Match</NavLink>
          <NavLink to="/chat">聊天 Chat</NavLink>
          <NavLink to="/login">登录 Login</NavLink>

          {/* 多语言按钮 */}
          <button className="lang-btn">语言</button>
        </div>
      </nav>

      {/* 页面路由切换 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<Match />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

/* 页面组件 */
function Home() {
  return (
    <section className="hero">
      <h1>技能交换平台 🚀</h1>
      <p>通过交换技能学习新知识</p>
    </section>
  )
}
function Match() { return <h1>匹配页面 Match Page</h1> }
function Chat() { return <h1>聊天页面 Chat Page</h1> }
function Login() { return <h1>登录页面 Login Page</h1> }

export default App