import React, { useState } from "react";
import { Formulario } from "../../../../componentes/Style/Formularios";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorWrapper from "../../errors";
import axios from "axios";
import { toast } from "react-toastify";

const Gestor = () => {

  // ---------------- Criação das Const ----------------
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState([]);
  const [primeiro_nome, setPrimeiro_nome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  // ---------------- FIM Criação das Const ----------------

  // Bloquear números
  function bloquearNumeros(event) {
    const tecla = event.which || event.keyCode;
    if (tecla >= 48 && tecla <= 57) {
      event.preventDefault();
    }
  }

  // --------- Função para validar CPF ---------
  function validarCPF(cpf) {    

    if (cpf.length !== 11) { // Verificar se o CPF possui 11 dígitos
      cpf = cpf.replace(/\D/g, ''); // Remover caracteres
      return false;
    }
      
    if (/^(\d)\1+$/.test(cpf)) { // Verificar se os dígitos do CPF são iguais
      return false;
    }
  
    // -------------- Verificação do primeiro dígito --------------
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let primeiroDigito = (soma * 10) % 11;
    if (primeiroDigito === 10 || primeiroDigito === 11) {
      primeiroDigito = 0;
    }
      
    if (parseInt(cpf.charAt(9)) !== primeiroDigito) { // Verificar o primeiro dígito
      return false;
    }
    // -------------- FIM Verificação do primeiro dígito --------------
  
    // -------------- Verificação do segudo dígito --------------
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    let segundoDigito = (soma * 10) % 11;
    if (segundoDigito === 10 || segundoDigito === 11) {
      segundoDigito = 0;
    }      
    if (parseInt(cpf.charAt(10)) !== segundoDigito) { // Verificar o segundo dígito
      return false;
    }
    // -------------- FIM Verificação do segudo dígito --------------

    return true;
  }

  function hasError(key) {
    return error.find((o) => o.key === key);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    //validação
    var errors = [];

    //primeiro_nome
    if (primeiro_nome === "") {
      errors.push({
        key: "primeiro_nome",
        value: "Informe o nome"
      });
    }
    //senha
    if (senha.length <= 5) {
      errors.push({
        key: "senha",
        value: "Informe no mínimo 6 caracteres"
      });
    }

    //cpf
    const validarCpf = validarCPF(cpf);

    if (!validarCpf) {
      errors.push({ key: "cpf", value: "CPF inválido" });
    }
    //email
    const validarEmail = /\S+@\S+\./;
    var validEmail = validarEmail.test(String(email));

    if (!validEmail) {
      errors.push({ key: "email", value: "Email invalido" });
    }

    setError(errors);

    if (errors.length > 0) {
      return false;
    } else {
      cadastro()
    }
  };

  const cadastro = () =>{
    axios.post("http://localhost:3001/cadastro", {
      cargo: "Gestor",
      cpf: parseInt(cpf),
      nome: primeiro_nome,
      email: email,
      senha: senha,
    })
    .then((res) =>{
      toast.success("Gestor cadastrado com sucesso!")
    })
    .catch((err) => {
      console.log(err)
      toast.error("Houve um erro!")
      toast.info("Verifique se esse CPF já foi cadastrado, ou se todos os campo foram preenchidos")
    })
  }

  return (
    <main>
      <Formulario action="">
        <Col>
          <Form.Label>CPF:</Form.Label>
          <Form.Control
            type="number"
            autoComplete="off"            
            name="cpf"
            className={
              hasError("cpf") ? "form-control is-invalid" : "form-control"
            }
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        <ErrorWrapper msg={hasError("cpf")?.value} />
        </Col>
        
        <Col>
          <Form.Label>Nome:</Form.Label>
          <Form.Control
            onKeyPress={bloquearNumeros}
            autoComplete="off"
            className={
              hasError("primeiro_nome")
                ? "form-control is-invalid"
                : "form-control"
            }
            name="primeiro_nome"
            value={primeiro_nome}
            onChange={(e) => setPrimeiro_nome(e.target.value)}
          />
          <ErrorWrapper msg={hasError("primeiro_nome")?.value} />
        </Col>

        <Col>
          <Form.Label>E-mail:</Form.Label>
          <Form.Control
            tipo="text"
            autoComplete="off"
            name="email"
            className={
              hasError("email") ? "form-control is-invalid" : "form-control"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ErrorWrapper msg={hasError("email")?.value} />
        </Col>
        
        <Col>
          <Form.Label>Senha:</Form.Label>
          <Form.Control
            tipo="text"
            autoComplete="off"
            name="senha"
            className={
              hasError("senha") ? "form-control is-invalid" : "form-control"
            }
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <ErrorWrapper msg={hasError("senha")?.value} />
        </Col>
      </Formulario>

      <Col>
        <div className="pt-4">
          <Button variant="success" size="sm" onClick={handleSubmit}>
            Cadastrar
          </Button>{" "}
        </div>
      </Col>
    </main>
  );
};
export default Gestor;
