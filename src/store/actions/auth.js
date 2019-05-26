import axios from '../../axios/axios-quiz'
import { AUTH_SUCCESS, AUTH_LOGOUT } from './actionTypes'


export function auth(email, password, isLogin) {
  return async dispatch => {
    const authData = {
      email, password,
      returnSecureToken: true
    }

    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDkGrZb884H_b3U53tDPBGRwSULRwFvplw'

    if (isLogin) {
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDkGrZb884H_b3U53tDPBGRwSULRwFvplw'
    }

    const response = await axios.post(url, authData);
    const data = response.data;

    const experationDate = new Date(new Date().getTime() + data.expiresIn * 1000);

    localStorage.setItem('token', data.idToken);
    localStorage.setItem('userId', data.localId);
    localStorage.setItem('experationDate', experationDate);

    dispatch(authSuccess(data.idToken));
    dispatch(autoLogout(data.expiresIn));
  }
}

export function autoLogout(time) {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    }, time * 1000)
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('experationDate');
  return {
    type: AUTH_LOGOUT
  }
}

export function autoLogin() {
  return dispatch => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch(logout())
    } else {
      const experationDate = new Date (localStorage.getItem('experationDate'));
      if (experationDate <= new Date()) {
        dispatch(logout())
      } else {
        dispatch(authSuccess(token));
        dispatch(autoLogout((experationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  }
}

export function authSuccess(token) {
  return {
    type: AUTH_SUCCESS,
    token
  }
}