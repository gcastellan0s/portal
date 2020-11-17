import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const ApiLoginService = {
  init () {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = process.env.AUTHENDPOINT
  },
  setHeaderLogin () {
    axios.defaults.headers.common.Authorization = 'Basic Z3VpYXBvcDoxTTU1KkFQT1A='
    axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
  },
  setHeaderVerify () {
    axios.defaults.headers.common.Authorization = 'Basic aW5mb2NvdmlkOjFtc3MxbmYwQ292aWQqMDE='
    axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
  },
  get (resource, slug = '') {
    return Vue.axios.get(`${resource}/${slug}`).catch(error => {
      throw new Error(`[KT] ApiService ${error}`)
    })
  },
  post (resource, params) {
    return Vue.axios.post(`${resource}`, params)
  }
}

export default ApiLoginService
