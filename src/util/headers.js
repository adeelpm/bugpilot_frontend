import Cookies from 'universal-cookie'
const cookies = new Cookies()
const headers={
    headers: {
        "Content-Type": "application/json",
        authorization: cookies.get('token'),
    }
}

export default headers