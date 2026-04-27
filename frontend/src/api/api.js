const BASE_URL = "http://127.0.0.1:8000"

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token")

  return fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  })
}

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  })

  return res.json()
}

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  return res.json()
}

export const getMe = async () => {
  const res = await authFetch("/users/me")
  return res.json()
}

export const getEvents = async () => {
  const res = await authFetch("/events")
  return await res.json()
}
