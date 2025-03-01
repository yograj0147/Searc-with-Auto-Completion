# Searc-with-Auto-Completion
High-Performance Search with Auto-Completion

# Tools used
elastic search
nodejs version 22
redis

# server start commands
npm start

# working
Setup elasticsearch, redis and nodejs in your system.
Create an .env file and copy the variables from the .env.example file.
On running npm start command it will start the server and it will dump some dummy data in the elasticsearch db.

# Api
http://localhost:3000/search?srchKey=protocol

type your keyword as a search value in place of protocol. 
