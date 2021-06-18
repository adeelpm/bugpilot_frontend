import Cookies from 'universal-cookie'
const cookies = new Cookies()
const headers={
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        authorization: cookies.get('token'),
    }
}

export default headers