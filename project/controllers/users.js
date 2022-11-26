import { v4 as uuidv4 } from 'uuid';
import { createConnection } from 'mysql';
import bcrypt, { hash } from 'bcrypt';
//import { send_registration_mail } from '../mail.js';

var db_config = {
  host: "eu-cdbr-west-03.cleardb.net",
  user: "b5aa4f76b3727d",
  password: "90067d9d",
  database: "heroku_12f139320673849"
};

var connection = createConnection(db_config);

function handleDisconect() {
  connection = createConnection(db_config);

  connection.connect((err) => {
    if (err) {
      console.log("Error while connecting to the database:", err);
      setTimeout(handleDisconect, 2000);
    }
    console.log("Connected to the Database")
  });

  connection.on("error", (err) => {
    console.log("database error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconect();
    }
    else {
      throw err;
    }
  });
};

handleDisconect();

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