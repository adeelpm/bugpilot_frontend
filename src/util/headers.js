import Cookies from 'universal-cookie'
const cookies = new Cookies()
const headers={
    headers: {
        authorization: cookies.get('token'),
    }
}

export default headers