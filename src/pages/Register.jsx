import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register({ text }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    email: ''
  })

  const [result, setResult] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRegister = async () => {
    const { username, password, phone, email} = formData

    if (!username || !password || !phone || !email) {
      setResult(text.fillAll)
      return
    }

    try {
      const res = await fetch('http://10.30.4.136:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          phone,
          email,
        })
      })

      const data = await res.json()

      if (res.ok) {
        setResult(`${text.registerBtn}成功：${data.username || username}`)
      } else {
        setResult(data.message || `${text.registerBtn}失败`)
      }
    } catch (err) {
      console.error('注册错误:', err)
      setResult('注册请求失败，请检查后端是否启动')
    }
  }

  return (
    <section className="auth-page">
      <h1>{text.registerPage}</h1>

      <div className="auth-form">
        <input
          name="username"
          placeholder={text.username}
          value={formData.username}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder={text.password}
          value={formData.password}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder={text.phone}
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder={text.email}
          value={formData.email}
          onChange={handleChange}
        />


        <div className="auth-buttons">
          <button onClick={handleRegister}>{text.registerBtn}</button>

          <button
            type="button"
            className="switch-btn"
            onClick={() => navigate('/login')}
          >
            {text.loginBtn}
          </button>
        </div>

        <p>{result}</p>
      </div>
    </section>
  )
}

export default Register