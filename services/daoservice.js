const Pool = require('pg').Pool;
const debug = require('debug')('chatanddrawapp:pgdao');
require('dotenv').config(); // tämä lukee .env-tiedoston
const PGUSER = process.env.PGUSER;
const PGPASSWORD = process.env.PGPASSWORD;

const conopts = {
    user: PGUSER,
    password: PGPASSWORD,
    host: 'localhost',
    database: 'piirtopeli',
    port: 5432
}
//console.log(process.env.DB_CONNECTIONSTRING)
const pool = new Pool(conopts);

process.on('exit', () => {
    debug("\n\n*** Ending pool when exiting");
    pool.end();
});

//Suvi
//hakee kaikki sanat
const getAllWords = (cb) => {
    pool.query('SELECT * from words', (err, results) => {
        if (err) throw err;
        console.dir(results);
        cb(results.rows);
    })
}
// //hakee pelaajien pistemäärät
// const getAllScores = (cb) => {
//     pool.query('SELECT * from scores', (err, results) => {
//         if (err) throw err;
//         console.dir(results);
//         cb(results.rows);
//     })
// }

// // Niina
// // Haetaan kaikki pelaajat kannasta
// //mitä varten? Listauspelaaja komponenttia varteko?
// const getPlayers = (callback) => {
//     pool.query("SELECT * from players", (error, data) => {
//         if (error) throw error;
//         console.dir(data);
//         callback(data.rows);
//     })
// }

// //Haetaan yksi pelaaja id:n perusteella kannasta
// //pitäisikö olla turn arvon perusteella? haetaanko jos turn on true (eli piirtovuorossa oleva).
// //tällöin yksittäinen pelaaja haetaan kannasta kun edellinen vuoro on päättynyt ja uusi vuoro on päivitetty kantaan
// const getPlayer = (id, callback) => {
//     pool.query("SELECT * FROM players where id =$1", [id], (error, data) => {
//         if (error) throw error;
//         console.dir(data.rows);
//         callback(data.rows);
//     })
// }

// //Lisätään uusi pelaaja kantaan, kanta generoi id, mutta socketid pitää saada clientista
// //mistä saadaan turn arvo false/true ja mikä lähtöarvo? Sijaitsee turn arvon antamisen logiikkaa clientissa vai bäckissä?
// const insertPlayer = (newplayer, callback) => {
//     const { socketid } = newplayer; // tuloksena pitää olla newplayer.socketid = value
//     pool.query("INSERT INTO players (socketid) VALUES ($1)", [socketid], (error, data) => {
//         if (error) throw error;
//         console.dir(data.rows);
//         callback(data.rowCount);
//     })
// }

// //let vuorostatus = arpoa.result //antaa statukseksi alustavasti false eli ei vuorossa
// //päivitetään pelaajan tiedot kannassa
// //ainoastaan turn(false/true) sarake (mutta koska put, niin kaikki sarakkeet pitää ilmoittaa ilmeisesti?)
// //Päivitetään piirtovuorossa olevan pelaajan vuorostatus truesta falseksi kun vuoro vaihtuu
// const updatePlayer = (player, id, callback) => {
//     const { socketid, turn } = player;
//     pool.query("UPDATE players SET socketid=$1, turn=$2", [socketid, turn, id], (error, data) => {
//         if (error) throw error;
//         console.dir(data.rows);
//         callback(data.rowCount);
//     })
// }

// //käyttäjä deletoidaan kannasta, kun hän kirjautuu ulos ja sulkee socketinsa.
// const deletePlayer = (id, callback) => {
//     pool.query("DELETE FROM player WHERE id=$1", [id], (error, data) => {
//         if (error) throw error;
//         console.dir(data.rows);
//         callback(data.rowCount);
//     })
// }

module.exports = { getAllWords }