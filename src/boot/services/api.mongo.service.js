const mongoendpoint = process.env.MONGOENDPOINT

const ApiMongoService = {
  init (method) {
    return {
      method: method,
      headers: this.setHeaders()
    }
  },
  setHeaders () {
    const headers = new Headers()
    return headers
  },
  url (resource) {
    return new URL(mongoendpoint + resource)
  },
  getUrl (resource, params) {
    const url = this.url(resource)
    url.search = new URLSearchParams(params).toString()
    return url
  },
  post (resource, params) {
    const request = this.init('POST')
    request.body = JSON.stringify(params)
    return fetch(this.url(resource), request)
  },
  get (resource, params) {
    const request = this.init('GET')
    return fetch(this.getUrl(resource, params), request)
  }
}

export default ApiMongoService
