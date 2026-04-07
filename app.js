function mostrarCadastro() {
    loginBox.style.display = "none";
    cadastroBox.style.display = "block";
}

function mostrarLogin() {
    loginBox.style.display = "block";
    cadastroBox.style.display = "none";
}

// CADASTRO
function cadastrar() {
    let user = cadUser.value;
    let pass = cadPass.value;
    let cpf = cadCpf.value;
    let data = cadData.value;
    let perfil = cadPerfil.value;

    if (!user || !pass || !cpf || !data) {
        alert("Preencha tudo");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.push({ user, pass, cpf, data, perfil });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Conta criada!");
    mostrarLogin();
}

// LOGIN
function login() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let u = usuarios.find(x => x.user === loginUser.value && x.pass === loginPass.value);

    if (!u) return alert("Login inválido");

    localStorage.setItem("userLogado", JSON.stringify(u));
    window.location.href = "dashboard.html";
}

// LOGOUT
function logout() {
    localStorage.removeItem("userLogado");
    window.location.href = "index.html";
}

// DASHBOARD
function carregarDashboard() {
    let u = JSON.parse(localStorage.getItem("userLogado"));
    if (!u) return window.location.href = "index.html";

    titulo.innerText = `Bem-vindo, ${u.user}`;

    if (u.perfil === "adm") telaAdmin();
    if (u.perfil === "professor") telaProfessor();
    if (u.perfil === "aluno") telaAluno();
}

// ADMIN
function telaAdmin() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let html = `
    <div class="card-box">
        <h4>Gerenciar Usuários</h4>

        <div class="row mb-3">
            <div class="col"><input id="novoUser" class="form-control" placeholder="Usuário"></div>
            <div class="col"><input id="novoPass" class="form-control" placeholder="Senha"></div>
            <div class="col"><input id="novoCpf" class="form-control" placeholder="CPF"></div>
            <div class="col"><input id="novaData" type="date" class="form-control"></div>
            <div class="col">
                <select id="novoPerfil" class="form-select">
                    <option value="aluno">Aluno</option>
                    <option value="professor">Professor</option>
                    <option value="adm">Admin</option>
                </select>
            </div>
            <div class="col">
                <button onclick="addUsuario()" class="btn btn-success w-100">Adicionar</button>
            </div>
        </div>

        <table class="table table-striped">
            <tr>
                <th>Usuário</th>
                <th>Perfil</th>
                <th>CPF</th>
                <th>Nascimento</th>
                <th>Senha</th>
                <th>Ação</th>
            </tr>
    `;

    usuarios.forEach((x, i) => {
        html += `
        <tr>
            <td>${x.user}</td>
            <td>${x.perfil}</td>
            <td>${x.cpf}</td>
            <td>${x.data}</td>
            <td>${x.pass}</td>
            <td><button onclick="excluirUsuario(${i})" class="btn btn-danger btn-sm">Excluir</button></td>
        </tr>`;
    });

    html += "</table></div>";

    conteudo.innerHTML = html;
}

function addUsuario() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.push({
        user: novoUser.value,
        pass: novoPass.value,
        cpf: novoCpf.value,
        data: novaData.value,
        perfil: novoPerfil.value
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    carregarDashboard();
}

function excluirUsuario(i) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.splice(i, 1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    carregarDashboard();
}

// PROFESSOR
function telaProfessor() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let alunos = usuarios.filter(x => x.perfil === "aluno");

    let notas = JSON.parse(localStorage.getItem("notas")) || {};

    let html = `<div class="card-box"><h4>Alunos</h4><table class="table">
    <tr><th>Aluno</th><th>CPF</th><th>N1</th><th>N2</th><th>N3</th><th>Status</th><th>Ação</th></tr>`;

    alunos.forEach(a => {
        let n = notas[a.user] || {};

        html += `
        <tr>
            <td>${a.user}</td>
            <td>${a.cpf}</td>
            <td><input id="n1_${a.user}" value="${n.n1 || ''}" class="form-control"></td>
            <td><input id="n2_${a.user}" value="${n.n2 || ''}" class="form-control"></td>
            <td><input id="n3_${a.user}" value="${n.n3 || ''}" class="form-control"></td>
            <td>
                <select id="status_${a.user}" class="form-select">
                    <option ${n.status==="Aprovado"?"selected":""}>Aprovado</option>
                    <option ${n.status==="Recuperação"?"selected":""}>Recuperação</option>
                    <option ${n.status==="Reprovado"?"selected":""}>Reprovado</option>
                </select>
            </td>
            <td><button onclick="salvarNota('${a.user}')" class="btn btn-primary btn-sm">Salvar</button></td>
        </tr>`;
    });

    html += "</table></div>";

    conteudo.innerHTML = html;
}

function salvarNota(user) {
    let notas = JSON.parse(localStorage.getItem("notas")) || {};

    notas[user] = {
        n1: document.getElementById(`n1_${user}`).value,
        n2: document.getElementById(`n2_${user}`).value,
        n3: document.getElementById(`n3_${user}`).value,
        status: document.getElementById(`status_${user}`).value
    };

    localStorage.setItem("notas", JSON.stringify(notas));
    alert("Salvo!");
}

// ALUNO
function telaAluno() {
    let u = JSON.parse(localStorage.getItem("userLogado"));
    let notas = JSON.parse(localStorage.getItem("notas")) || {};

    let n = notas[u.user];

    if (!n) {
        conteudo.innerHTML = `<div class="card-box"><h4>Sem notas ainda</h4></div>`;
        return;
    }

    conteudo.innerHTML = `
    <div class="card-box">
        <h4>Minhas Notas</h4>
        <table class="table">
            <tr><th>N1</th><th>N2</th><th>N3</th><th>Status</th></tr>
            <tr>
                <td>${n.n1}</td>
                <td>${n.n2}</td>
                <td>${n.n3}</td>
                <td><strong>${n.status}</strong></td>
            </tr>
        </table>
    </div>`;
}