from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import insert, consultar, delete, update, conexao 

app = Flask(__name__)
app.secret_key = 'chave_escola_2024'

# ROTA DE LOGIN
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form.get('usuario')
        senha = request.form.get('senha')
        perfil = request.form.get('perfil')

        if perfil == 'adm' and usuario == 'root' and senha == 'root':
            session['perfil'] = 'adm'
            session['usuario'] = 'Administrador'
            return redirect(url_for('dashboard'))
        
        session['perfil'] = perfil
        session['usuario'] = usuario
        return redirect(url_for('dashboard'))

    return render_template('login.html')

# DASHBOARD
@app.route('/dashboard')
def dashboard():
    if 'perfil' not in session:
        return redirect(url_for('login'))
    
    alunos_lista = []
    if session['perfil'] in ['adm', 'professor']:
        alunos_lista = consultar.listar_alunos()

    return render_template('dashboard.html', alunos=alunos_lista)

# PÁGINA DE CADASTRO
@app.route('/cadastro')
def pagina_cadastro():
    if session.get('perfil') != 'adm':
        return "Acesso negado", 403
    return render_template('cadastro.html')

# AÇÃO DE CADASTRAR ALUNO (COM SENHA)
@app.route('/cadastrar_aluno', methods=['POST'])
def cadastrar_aluno():
    nome = request.form.get('nome')
    mae = request.form.get('mae')
    cpf = request.form.get('cpf')
    rg = request.form.get('rg')
    data = request.form.get('data_nasc')
    senha = request.form.get('senha') # Novo campo
    
    insert.cadastrar_aluno_web(nome, mae, cpf, rg, data, senha)
    return redirect(url_for('dashboard'))

# AÇÃO DE CADASTRAR PROFESSOR (COM SENHA)
@app.route('/cadastrar_professor', methods=['POST'])
def cadastrar_professor():
    nome = request.form.get('nome_prof')
    cpf = request.form.get('cpf_prof')
    turma = request.form.get('turma')
    senha = request.form.get('senha_prof') # Novo campo
    
    conn = conexao.conectar_banco()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO professores (nome_professor, cpf, turma_associada, senha) 
        VALUES (%s, %s, %s, %s)
    """, (nome, cpf, turma, senha))
    conn.commit()
    conn.close()
    return redirect(url_for('dashboard'))

if __name__ == '__main__':
    app.run(debug=True)