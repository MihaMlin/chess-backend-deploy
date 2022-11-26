import { v4 as uuidv4 } from 'uuid';
import { createConnection } from 'mysql';
import bcrypt, { hash } from 'bcrypt';
//import { send_registration_mail } from '../mail.js';

var connection = createConnection({
  host: "localhost",
  user: "root",
  //password: "root"
  database: "chess_RPO_2022"
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the Database")
});

export const getUsers = (req, res) => {
  connection.query("SELECT * FROM chess_user", (err, result, fields) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
};

export const createUser = async (req, res) => {

  const user = req.body;

  // generiramo hash password
  const salt = await bcrypt.genSalt(); //default value 10
  const hashedPassword = await bcrypt.hash(user.user_password, salt); // salt se shrani v password

  // sharinmo userja v database
  var sql = `INSERT INTO chess_user (id, first_name, last_name, username, email, user_password, mail_validation, token, rating) VALUES ('${user.id}','${user.first_name}','${user.last_name}','${user.username}','${user.email}','${hashedPassword}',${user.mail_validation},'${user.token}', ${user.rating});`
  
  //send_registration_mail(user.email);

  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
};

export const getUser =(req, res) => {
  const { id } = req.params;
  connection.query(`SELECT * FROM chess_user WHERE id = '${id}'`, (err, result, fields) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
};

export const deleteUser =(req, res) => {
  const { id } = req.params;
  connection.query(`DELETE FROM chess_user WHERE id = '${id}'`, (err, result, fields) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
};

export const updateUser = (req, res) => { // spremenimo le ime in priimek hkrati
  const { id } = req.params;
  const { first_name, last_name, username, email, user_password, rating } = req.body;
  if (first_name && last_name) {
    connection.query(`UPDATE chess_user SET first_name = '${first_name}', last_name = '${last_name}' WHERE id = '${id}'`, (err, result, fields) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  }
};