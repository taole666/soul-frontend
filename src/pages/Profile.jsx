import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultAvatar from '../assets/default-avatar.png'

function Profile({ text, user, setUser }) {
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState('')
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState({
    username: '',
    phone: '',
    email: '',
    address: '',
    avatar: '',
    gender: '',
    age: '',
    teachSkill: '',
    learnSkill: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.username) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(
          `http://10.30.4.136:8080/api/profile?username=${encodeURIComponent(user.username)}`
        )

        const data = await res.json()

        if (res.ok) {
          const profileData = {
            username: data.username || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            avatar: data.avatar || '',
            gender: data.gender || '',
            age: data.age || '',
            teachSkill: data.teachSkill || '',
            learnSkill: data.learnSkill || ''
          }

          setProfile(profileData)
          setUser(profileData)
          localStorage.setItem('loginUser', JSON.stringify(profileData))
        } else {
          setResult(data.message || '获取个人信息失败')
        }
      } catch (err) {
        console.error('获取个人信息失败:', err)
        setResult('获取个人信息失败，请检查后端')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, setUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploading(true)
      setResult('')

      const res = await fetch('http://10.30.4.136:8080/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok) {
        setProfile((prev) => ({
          ...prev,
          avatar: data.url
        }))
        setResult(text.uploadSuccess || '头像上传成功')
      } else {
        setResult(data.message || '头像上传失败')
      }
    } catch (err) {
      console.error('头像上传失败:', err)
      setResult('头像上传失败，请检查后端是否启动')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch('http://10.30.4.136:8080/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      })

      const data = await res.json()

      if (res.ok) {
        const updatedUser = {
          username: data.username || profile.username,
          phone: data.phone || profile.phone,
          email: data.email || profile.email,
          address: data.address || profile.address,
          avatar: data.avatar || profile.avatar,
          gender: data.gender || profile.gender,
          age: data.age || profile.age,
          teachSkill: data.teachSkill || profile.teachSkill,
          learnSkill: data.learnSkill || profile.learnSkill
        }

        setProfile(updatedUser)
        setUser(updatedUser)
        localStorage.setItem('loginUser', JSON.stringify(updatedUser))
        setResult(text.saveSuccess || '保存成功')
        setIsEditing(false)
      } else {
        setResult(data.message || '保存失败')
      }
    } catch (err) {
      console.error('保存个人信息失败:', err)
      setResult('保存失败，请检查后端是否启动')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('loginUser')
    setUser(null)
    navigate('/')
  }

  if (!user) {
    return (
      <section className="profile-page">
        <h1>{text.profilePage || '个人信息页面'}</h1>
        <p>{text.notLoggedIn || '当前未登录'}</p>
        <button onClick={() => navigate('/login')}>
          {text.loginBtn || '登录'}
        </button>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="profile-page">
        <h1>{text.profilePage || '个人信息页面'}</h1>
        <p>{text.loading || '加载中...'}</p>
      </section>
    )
  }

  return (
    <section className="profile-page">
      <h1>{text.profilePage || '个人信息页面'}</h1>

      <div className="profile-card">
        <div className="profile-top">
          <img
            src={profile.avatar && profile.avatar.trim() ? profile.avatar : defaultAvatar}
            alt="avatar"
            className="profile-avatar"
            onError={(e) => {
              e.target.src = defaultAvatar
            }}
          />

          <div className="profile-basic">
            <h2>{profile.username || 'User'}</h2>
            <p>{text.welcome || '欢迎来到个人中心'}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="profile-form">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
            />

            <input
              name="username"
              placeholder={text.username}
              value={profile.username}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder={text.phone}
              value={profile.phone}
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder={text.email}
              value={profile.email}
              onChange={handleChange}
            />

            <input
              name="address"
              placeholder={text.address}
              value={profile.address}
              onChange={handleChange}
            />

            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="">{text.gender || '性别'}</option>
              <option value="male">{text.male || '男'}</option>
              <option value="female">{text.female || '女'}</option>
              <option value="other">{text.other || '其他'}</option>
            </select>

            <input
              name="age"
              placeholder={text.age || '年龄'}
              value={profile.age}
              onChange={handleChange}
            />

            <input
              name="teachSkill"
              placeholder={text.teachSkill || '擅长的技能'}
              value={profile.teachSkill}
              onChange={handleChange}
            />

            <input
              name="learnSkill"
              placeholder={text.learnSkill || '想学习的技能'}
              value={profile.learnSkill}
              onChange={handleChange}
            />

            <div className="profile-actions">
              <button onClick={handleSave} disabled={uploading}>
                {uploading ? (text.uploading || '上传中...') : (text.save || '保存')}
              </button>
              <button
                type="button"
                className="switch-btn"
                onClick={() => setIsEditing(false)}
              >
                {text.cancel || '取消'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="profile-info">
              <div className="profile-row">
                <span className="profile-label">{text.username || '用户名'}</span>
                <span>{profile.username || '-'}</span>
              </div>

              <div className="profile-row">
                <span className="profile-label">{text.phone || '电话'}</span>
                <span>{profile.phone || '-'}</span>
              </div>

              <div className="profile-row">
                <span className="profile-label">{text.email || '邮箱'}</span>
                <span>{profile.email || '-'}</span>
              </div>

              <div className="profile-row">
                <span className="profile-label">{text.address || '地址'}</span>
                <span>{profile.address || '-'}</span>
              </div>

              <div className="profile-row">
                <span className="profile-label">{text.gender || '性别'}</span>
                <span>
                  {profile.gender === 'male'
                    ? text.male || '男'
                    : profile.gender === 'female'
                    ? text.female || '女'
                    : profile.gender === 'other'
                    ? text.other || '其他'
                    : '-'}
                </span>
              </div>

              <div className="profile-row">
                <span className="profile-label">{text.age || '年龄'}</span>
                <span>{profile.age || '-'}</span>
              </div>

              <div className="profile-row">
                <span className="profile-label">{text.teachSkill || '擅长的技能'}</span>
                <span>{profile.teachSkill || '-'}</span>
              </div>

              <div className="profile-row">
                <span className="profile-label">{text.learnSkill || '想学习的技能'}</span>
                <span>{profile.learnSkill || '-'}</span>
              </div>
            </div>

            <div className="profile-actions">
              <button onClick={() => setIsEditing(true)}>
                {text.editProfile || '编辑资料'}
              </button>
              <button onClick={() => navigate('/')}>
                {text.home || '首页'}
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                {text.logout || '退出登录'}
              </button>
            </div>
          </>
        )}

        {result && <p>{result}</p>}
      </div>
    </section>
  )
}

export default Profile