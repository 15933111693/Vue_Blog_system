import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/attribute',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  if(!id) return
  return request({
    url: `/api/users/${id}`,
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/api/attribute/logout',
    method: 'get'
  })
}
