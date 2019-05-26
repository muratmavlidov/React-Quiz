import axios from 'axios';

export default axios.create({
  baseURL: 'https://react-quiz-90be0.firebaseio.com/'
})