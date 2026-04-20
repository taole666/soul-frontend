import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login({ text, setUser }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username || !password) {
      setResult(text.fillAll)
      return
    }

    try {
      const res = await fetch('http://10.30.4.136:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (res.ok) {
        const loginUser = {
          username: data.username || username,
          avatar: data.avatar || 'https://via.placeholder.com/36'
        }

        localStorage.setItem('loginUser', JSON.stringify(loginUser))
        setUser(loginUser)

        navigate('/') // 回首页
      } else {
        setResult('登录失败')
      }
    } catch (err) {
      console("登陆错误",err)
      setResult('请求失败')
    }
  }

  return (
    <section className="auth-page">
      <h1>{text.loginPage}</h1>

      <div className="auth-form">
        <input
          type="text"
          placeholder={text.username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder={text.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 👇 按钮组 */}
        <div className="auth-buttons">
          <button onClick={handleLogin}>{text.loginBtn}</button>

          <button
            type="button"
            className="switch-btn"
            onClick={() => navigate('/register')}
          >
            {text.registerBtn}
          </button>
        </div>

        <p>{result}</p>
      </div>
    </section>
  )
}

export default Login