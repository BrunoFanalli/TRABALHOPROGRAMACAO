from conexao import conectar_banco

def deletar_aluno():
    conn = conectar_banco()

    if conn:
        cursor = conn.cursor()

        id_aluno = input("Digite o ID do aluno que deseja excluir: ")

        sql = "DELETE FROM alunos WHERE id = %s"

        cursor.execute(sql, (id_aluno,))
        conn.commit()

        print("Aluno excluído com sucesso!")

        cursor.close()
        conn.close()