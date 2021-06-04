Steps to run:

1. Load data in mysql database using load_data.py. Arguments are described as follows:
    file_path - Path to csv file
    username - mysql database username
    password - mysql database password
    hostname - mysql database host
    db_name - mysql schema name
    table_name - mysql table name
    primary_key - Desired primary key column from the csv file

2. ```cd backend && npm i && npm start```
3. In another tab, do 
  ```cd frontend && npm i && npm start```
4. Goto localhost:3000 on browser.
5. If using different hostname and port on backend, first change the port in backend/index.js and then change the port in frontend/src/config.js.
6. If using different hostname and port on mysql database, change the info in backend/src/config.js.