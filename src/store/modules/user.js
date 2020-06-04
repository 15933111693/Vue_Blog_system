import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  id: '',
  introduce: '',
  roleId: '',
  roleName: '',
  states: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password, authType } = userInfo
    const res = await login({ account: username.trim(), credential: password, authType: authType })
    const {token, userId} = res
    commit('SET_ID', userId)
    localStorage.id = userId
    commit('SET_TOKEN', token)
    setToken(token)
    localStorage.token = token
    // return new Promise((resolve, reject) => {
    //   adminLogin({ account: username.trim(), credential: password, authType: authType }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  async getInfo({ commit, state }) {
    const userInfo = await getInfo(state.id || localStorage.id )
    for(let i in userInfo) {
      state[i] = userInfo[i]
    }
  },

  // user logout
  async logout({ commit, state }) {
    const res = await logout()
    if(res) {
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
    }

    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     commit('SET_TOKEN', '')
    //     removeToken()
    //     resetRouter()
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

