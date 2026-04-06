from conexao import conectar_banco

# FUNÇÃO PARA CADASTRAR ALUNO NO BANCO
def cadastrar_aluno_web(nome, mae, cpf, rg, data, senha):
    conn = conectar_banco()
    if conn:
        cursor = conn.cursor()
        # Adicionado a coluna 'senha' e o sexto parâmetro '%s'
        sql = """INSERT INTO alunos (nome_aluno, nome_mae, cpf, rg, data_nasc, senha) 
                 VALUES (%s, %s, %s, %s, %s, %s)"""
        
        cursor.execute(sql, (nome, mae, cpf, rg, data, senha))
        conn.commit()
        cursor.close()
        conn.close()

# FUNÇÃO PARA LANÇAR NOTAS E CALCULAR MÉDIA (REQUISITO 5.2)
def lancar_nota_web(id_aluno, n1, n2, n3):
    conn = conectar_banco()
    if conn:
        cursor = conn.cursor()
        # Cálculo automático da média
        media = (float(n1) + float(n2) + float(n3)) / 3
        
        sql = "INSERT INTO notas (id_aluno, n1, n2, n3, media) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (id_aluno, n1, n2, n3, media))
        
        conn.commit()
        cursor.close()
        conn.close()