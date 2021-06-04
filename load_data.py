import pandas as pd
import mysql.connector
import sqlalchemy

def build_table(file_path, username, password, hostname, db_name, table_name, primary_key):
    try:
        # Read the file into a pandas dataframe
        data = pd.read_csv(file_path)
        
        # Setup the mysql connection
        cfg_uri_mysql = f'mysql+mysqlconnector://{username}:{password}@{hostname}/{db_name}'
            
        # Configure sqlengine
        sqlengine = sqlalchemy.create_engine(cfg_uri_mysql)
        
        # Save the pandas df to mysql
        data.to_sql(f'{table_name}',sqlengine,if_exists='append', index=False)
        
        # Open a connection
        connection = mysql.connector.connect(host=hostname, user=username, password=password)
        
        # Query for inserting primary key
        query = f"ALTER TABLE `{db_name}`.`{table_name}` ADD PRIMARY KEY (`{primary_key}`);"
        
        # Execute the query and commit
        cursor = connection.cursor()
        cursor.execute(query)
        connection.commit()
        return "Data added, check your db"
    except:
        return "Some error occured"

#Change the values accordingly
build_table('takehome.csv', 'root', 'root', 'localhost', 'cadence', 'example2', 'Order ID')