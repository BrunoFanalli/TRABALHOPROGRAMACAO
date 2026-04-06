from conexao import conectar_banco

def atualizar_aluno():
    conn = conectar_banco()

    if conn:
        cursor = conn.cursor()

        id_aluno = input("Digite o ID do aluno: ")
        novo_nome = input("Novo nome: ")

        sql = "UPDATE alunos SET nome = %s WHERE id = %s"

        cursor.execute(sql, (novo_nome, id_aluno))
        conn.commit()

        print("Aluno atualizado com sucesso!")

        cursor.close()
        conn.close()