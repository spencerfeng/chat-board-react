import Moment from 'moment'

export const isLoggedIn = () => {
  return !!localStorage.getItem('chat-board-react-token')
}

export const dateObjToFormattedStr = (dateObj) => {
  return Moment(dateObj).format('DD/MM/YYYY hh:mm:ss')
}