export default ({ router, store }) => {
  router.beforeEach((to, from, next) => {
    Promise.all([store.dispatch('verifyAuth')]).then(next)
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  })
}
