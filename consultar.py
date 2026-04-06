from conexao import conectar_banco

def listar_alunos():
    conn = conectar_banco()
    if conn:
        cursor = conn.cursor()
        # O ERRO ESTAVA AQUI: Mudamos de 'nome' para 'nome_aluno'
        cursor.execute("SELECT id_aluno, nome_aluno, nome_mae, cpf, rg, data_nasc FROM alunos ORDER BY nome_aluno")
        alunos = cursor.fetchall()
        cursor.close()
        conn.close()
        return alunos
    return []