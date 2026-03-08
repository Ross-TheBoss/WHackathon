const express = require('express');
const app = express();
const port = 8443;

var serveIndex = require('serve-index');

var registerUsername;
var registerPassword;
var loginUsername;
var loginPassword;

app.use(express.json());
app.use(express.urlencoded());

app.listen(port, () => 
{
  console.log(`App listening on port ${port}`);
});

app.get('/', (request, response) =>
{
  response.sendFile('C:/Users/PC/Documents/Visual Studio Code/WHackathon/app/frontend/public/index.html');
});

app.use(express.static("C:/Users/PC/Documents/Visual Studio Code/WHackathon/app/frontend/public"));
app.use("/public", serveIndex("C:/Users/PC/Documents/Visual Studio Code/WHackathon/app/frontend/public"));

app.use(express.static("C:/Users/PC/Documents/Visual Studio Code/WHackathon/app/frontend/src"));
app.use("/src", serveIndex("C:/Users/PC/Documents/Visual Studio Code/WHackathon/app/frontend/src"));

app.post('/submit', (request, response) =>
{
  registerUsername = request.body.RegisterUsername;
  registerPassword = request.body.RegisterPassword;
  loginUsername = request.body.LoginUsername;
  loginPassword = request.body.LoginPassword;

  const clickerDatabase = require("mysql2");
  
  const connection = clickerDatabase.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "WHackathon",
    database: "hackathon_database"
  });

  if ((registerUsername != null) && (registerPassword != null))
  {
    var sql = `INSERT INTO data VALUES (NULL, '${registerUsername}', '${registerPassword}')`;
  }
  
  if ((loginUsername != null) && (loginPassword != null))
  {
    var sql = `SELECT username, password FROM data`;
  }

  connection.connect(function(error) 
    {
      if (error)
      {
        console.error("Error connecting to database:", error);
      }
      else 
      {
        console.log("Connected to database");
        connection.query(sql, function (error)
        {
          if (error)
          {
            console.error("Error connecting to database:", error);
          }
          else
          {
            if ((registerUsername != null) && (registerPassword != null))
            {
              response.sendFile('C:/Users/PC/Documents/Visual Studio Code/WHackathon/app/frontend/public/home.html');
              //app.use(express.static(''));
            }

            if ((loginUsername != null) && (loginPassword != null))
            {
              async function getResult()
              {
                const [rows, fields] = await connection.promise().query(sql);

                for (let step = 0; step < rows.length; step++)
                {
                  if ((rows[step].username == loginUsername) && (rows[step].password == loginPassword))
                  {
                    app.use(express.static(''));
                    response.redirect('/home.html');
                  }
                }
              };

              getResult();
            }
            console.log("Query Successful");
          }
        });
      }
    });
});
