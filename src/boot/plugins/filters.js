import Vue from 'vue'
import moment from 'moment'

Vue.filter('DateTime', function (value) {
  if (!value) return '-'
  return moment(value).format('LL')
})
