module.exports = (client, member) => {
    const mysql = require('mysql');

    const connection = new mysql.createConnection({
        host: process.env.dbHost,
        user: process.env.dbUsername,
        password: process.env.dbPassword,
        database: "parhelion"
    });

    connection.query(`SELECT * FROM invites WHERE inviter=${member.user.id}`, function (error, results, fields) {
        if (!resultsh || !results[0]) return;

        connection.query(`REMOVE FROM invites WHERE inviter=${member.user.id}`);
    });
}