import psycopg2
from psycopg2 import Error

def conectar_banco():
    try:
        conexao = psycopg2.connect(
            host="localhost",
            database="escola",
            user="postgres",
            password="35460",
            port=5432
        )
        return conexao
    except Error as e:
        print(f"Erro ao conectar ao PostgreSQL: {e}")
        return None