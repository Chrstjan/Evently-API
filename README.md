# Guide
- Clone the project
 - Run npm install in the root folder
  # MySql setup
  This api requires you have a MySql database setup. Create a database with the name: evently in your prefered program
  # .env setup
 - Make an env file in root folder with the following
   ```dotenv
    PORT = 8080
    DBNAME = evently
    DBUSER = root
    DBPASSWORD=your-password
    DBHOST = localhost
    DBPORT = 3306

   
    TOKEN_ACCESS_KEY=secret_token_key
    TOKEN_ACCESS_EXPIRATION_SECS=3600


    TOKEN_REFRESH_KEY=secret_token_key
    TOKEN_REFRESH_EXPIRATION_SECS=86400
    ```
    ## DBUSER & DBPASSWORD
        Should both be changed to the username you login with in MySql (default is root), Password should also be changed
    - Run ```node --watch index.js``` in the terminal
    - The server should now run and you can work with the api
   # Seeding data
     To insert dummy data into the database open your browser and navigate to the following route:
     localhost:8080/seed
# Postman Docs
https://documenter.getpostman.com/view/30344673/2sB2ixjEC1
