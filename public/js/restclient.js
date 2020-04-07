import Axios from 'axios';
// import io from 'socket.io-client'

let getAllWords = async () => {
    let result = await Axios.get('http://localhost:3000/draw/Piirtoalias/word')
    return result.data;
}

export { getAllWords }
