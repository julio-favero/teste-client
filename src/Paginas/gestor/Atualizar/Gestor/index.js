import React, { useState } from "react";
import { Formulario } from "../../../../componentes/Style/Formularios";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorWrapper from "../../errors";
import axios from "axios";
import { toast } from "react-toastify";

const Gestor = (props) => {

  // --------------- Criação das Const ---------------
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState([]);
  const [primeiro_nome, setPrimeiro_nome] = useState("");
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(true);
  // --------------- Criação das Const ---------------

  // Bloquear Número do Input
  function bloquearNumeros(event) {
    const tecla = event.which || event.keyCode;
    if (tecla >= 48 && tecla <= 57) {
      event.preventDefault();
    }
  }

  function hasError(key) {
    return error.find((o) => o.key === key);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    //validação
    var errors = [];

    //cpf
    const validarCpf = /^\d{11}$/;
    var validCpf = validarCpf.test(Number(cpf));

    if (!validCpf) {
      errors.push({ key: "cpf", value: "Cpf invalido" });
    }

    setError(errors);

    //email
    const validarEmail = /\S+@\S+\./;
    var validEmail = validarEmail.test(String(email));

    //primeiro_nome
    if (primeiro_nome === "") {
      errors.push({
        key: "primeiro_nome",
        value: "Informe o nome"
      });
    }

    if (!validEmail) {
      errors.push({ key: "email", value: "E-mail inválido" });
    }

    if (errors.length > 0) {
      return false;
    } else {
      alterar()
    }
  };

  const buscar = () => {
    axios.post("http://localhost:3001/listarTodos",{
      cargo: props.cargo,
      cpf: cpf,
    })
    .then((res) => {
      setPrimeiro_nome(res.data.nome)
      setEmail(res.data.email)
      toast.info("Atualize os campos desejados!")
      setDisabled(false)
    })
    .catch((err) => {
      toast.error("Gestor não encontrado!")
      setPrimeiro_nome("")
      setEmail("")
      setDisabled(true)
    })
  }

  const alterar = () => {
    axios.put('http://localhost:3001/alterar',{
      cargo: props.cargo,
      cpf: cpf,
      nome: primeiro_nome,
      email: email,
    })
    .then((res) => {
      toast.success('Gestor atualizado com sucesso!')
    })
    .catch((err) => {
      console.log(err)
      toast.error('Não foi possível atualizar o Gestor!')
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
          <div className={hasError("cpf") ? "inline-errormsg" : "hidden"}>
            Escreva corretamente seu cpf
          </div>
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
          <div className={hasError("email") ? "inline-errormsg" : "hidden"}>
            Escreva corretamente seu e-mail
          </div>
        </Col>
        <Col>
          <Form.Label>Nome:</Form.Label>
          <Form.Control
            autoComplete="off"
            className={
              hasError("primeiro_nome")
                ? "form-control is-invalid"
                : "form-control"
            }
            onKeyPress={bloquearNumeros}
            name="primeiro_nome"
            value={primeiro_nome}
            onChange={(e) => setPrimeiro_nome(e.target.value)}
          />
          <ErrorWrapper msg={hasError("primeiro_nome")?.value} />
        </Col>
      </Formulario>

      <Col>
        <div class="pt-4">
          <Button variant="success" size="sm" onClick={buscar}>
            Buscar
          </Button>{" "}
          <Button disabled={disabled} variant="success" size="sm" onClick={handleSubmit}>
            Atualizar
          </Button>{" "}
        </div>
      </Col>
    </main>
  );
};
export default Gestor;
