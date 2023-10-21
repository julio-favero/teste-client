import React, { useState, useEffect } from "react";
import { Formulario } from "../../../../componentes/Style/Formularios";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorWrapper from "../../errors";
import axios from "axios";
import { toast } from "react-toastify";

//  Importações relacionadas o calendário do campo Data
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

registerLocale('pt-BR', ptBR); // Registrar o calendário como BR
setDefaultLocale('pt-BR'); // Definir o calendário como BR

  // ------------------------- Criação das Const -------------------------
  const Atleta = (props) => {
  const [cpf, setCpf] = useState();
  const [error, setError] = useState([]);
  const [primeiro_nome, setPrimeiro_nome] = useState("");
  const [nascimento, setNascimento] = useState(""); 
  const [nasc, setNasc] = useState(""); 
  const [categoria, setCategoria] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [posição, setPosição] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [sexo, setSexo] = useState("");
  // ------------------------- FIM Criação das Const -------------------------

  // ------------------------- Funções para realizar as validações dos inputs -------------------------
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

  // ---------------- Formatar data ----------------
  const formatarData = () => {
    if (nascimento) {    
      const dataFormatada = format(nascimento, 'yyyy-MM-dd'); // Padrão BD  
      setNasc(dataFormatada.toString())                             
    }
  };

  useEffect(() => {
    formatarData();
  }, [nascimento]);


  function hasError(key) {
    return error.find((o) => o.key === key);
  }


  //  Retorna os erros para o usuário -------------
  const handleSubmit = () => {
    //validação
    var errors = [];

    //primeiro_nome
    if (primeiro_nome === "") {
      errors.push({
        key: "primeiro_nome",
        value: "Informe o nome"
      });
    }

    //categoria
    if (categoria === "") {
      errors.push({
        key: "categoria",
        value: "Selecione a Categoria"
      });
    }

    //Sexo
    if (sexo === "") {
      errors.push({
        key: "sexo",
        value: "Selecione o sexo"
      });
    }
    //modalidade
    if (modalidade === "") {
      errors.push({
        key: "modalidade",
        value: "Selecione a modalidade"
      });
    }
    //senha
    if (senha.length <= 5) {
      errors.push({
        key: "senha",
        value: "Informe no mínimo 6 caracteres"
      });
    }
    // Data
    if (nasc === "") {
      errors.push({
        key: "data",
        value: "Selecione a Data"
      });
    }
    //modalidade
    if (posição === "") {
      errors.push({
        key: "posição",
        value: "Selecione a posição"
      });
    }

    const validarCpf = validarCPF(cpf);

    if (!validarCpf) {
      errors.push({ key: "cpf", value: "CPF inválido" });
    }
    //email
    const validarEmail = /\S+@\S+\./;
    var validEmail = validarEmail.test(String(email));

    if (!validEmail) {
      errors.push({ key: "email", value: "Email inválido" });
    }

    setError(errors);

    if (errors.length > 0) {
      return false;
    } else {
      cadastro()
    }
  };
  // ------------------------- FIM Funções para realizar as validações dos inputs -------------------------
  
  // getCategorias é uma função que criei, ela que vai gerar os valores que o campo categoria vai ter
  // Desse jeito os valores ficam dinámicos para cada esporte 
  const getCategorias = () => {     
    if (modalidade === 'Atletismo Olímpico') {
      return ['Corrida com obstáculos.', 
              'Corridas rasas de velocidade.', 
              'Decatlo e Heptatlo.',
              'Lançamentos.',
              'Meio-Fundo e Fundo.',
              'Provas de revezamento.',
              'Provas de rua.',
              'Saltos.'    
            ];
    } 
    else if (modalidade === 'Atletismo Paralímpico') {
      return ['Lançamento de disco', 
              'Salto em distância',
              'Lançamento de Dardo',
              'Arremesso de peso',
              'Salto em Altura.',
              'Salto Triplo'
            ];
    } 
    else if (modalidade === 'Ginástica Artística') {
      return ['Solo', 
              'Barras paralelas',
              'Barras Fixas',
              'Cavalo com alças e argolas',
              'Trave de Equilíbrio',
              'Barras Assimétricas'
            ];
    } 
    else if (modalidade === 'Luta Olímpica') {
      return ['Livre', 
              'Romana',              
            ];
    } 
    else if (modalidade === 'Natação') {
      return ['Crawl', 
              'Costas', 
              'Borboleta',
              'Peito'
            ];
    }
    else if (modalidade === 'Vôlei') {
      return ['Vôlei de quadra', 
              'vôlei de praia', 
              'vôlei sentado',
              'futevôlei'
            ];
    }
    else {
      return ['Padrão'];
    }
  };

  // getPosicao é uma função que criei, ela que vai gerar os valores que o campo posição vai ter
  // Desse jeito os valores ficam dinámicos para cada esporte 
  const getPosicao = () => {
    if (modalidade === 'Basquete') {
      return ['Armador', 
              'Ala-armador',
              'Ala',
              'Ala-pivô',
              'Pivô'
            ];
    }
    else if (modalidade === 'Goalball') {
      return ['Ala Esquerdo', 
              'Pivô',
              'Ala direito'
            ];
    } 
    else if (modalidade === 'Polo Aquático') {
      return ['Ponta Direita', 
              'ponta Esquerda',
              'Alas',
              'Armador',
              'Central'
             ];
    } 
    else if (modalidade === 'Vôlei') {
      return ['Levantador', 
              'Oposto',
              'Ponteiro',
              'Central',
              
            ];
    }  
    else {
      return ['Padrão'];
    }
  };

  const categorias = getCategorias(); // Variável responsável por pegar os campos da categoria
  const posicoes = getPosicao();// Variável responsável por pegar os campos da posição

  //  ---------------- Back-End CADASTRO ----------------
  const cadastro = () =>{
    axios.post("http://localhost:3001/cadastro", {
      cpf: parseInt(cpf),
      nome: primeiro_nome,
      senha: senha,
      email: email,
      d_nasc: nasc,
      sexo: sexo,
      categoria: categoria,
      posicao: posição,
      cargo: "Atleta",
      modalidade: modalidade,  
    })
    .then((res) =>{
      toast.success("Atleta cadastrado com sucesso!")
    })
    .catch((err) => {
      toast.error("Houve um erro!")      
      toast.info("Verifique se esse CPF já foi cadastrado")
    })
  }

  return (
    <main>
      <Formulario action="">

        {/* Input do CPF */}
        <Col>
          <Form.Label>CPF:</Form.Label>
          <Form.Control
            type ="number"
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

        {/* Input do nome */}
        <Col>
          <Form.Label name="nome" >Nome:</Form.Label>
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

        {/* Input da Data de Nascimento */}
        <Col>
          <Form.Label name="data_nasc">Data de nascimento: </Form.Label>
          <br/>
          <DatePicker
            selected={nascimento}
            onChange={(date) => setNascimento(date)}
            dateFormat="dd/MM/yyyy"
            showMonthDropdown
            showYearDropdown
            required
            dropdownMode="select"
            className="form-control"
            locale="pt-BR"
          />
          <ErrorWrapper msg={hasError("data")?.value} />
        </Col>

        {/* Input da Modalidade */}
        <Col>
        <Form.Label name="modalidade">Modalidade:</Form.Label>
        <Form.Select
          autoComplete="off"
          className="form-control"
          name="modalidade"
          value={modalidade}
          onChange={(e) => setModalidade(e.target.value)}
        >
          <option value="" disabled>Selecione uma modalidade</option>
          <option value="Atletismo Olímpico">Atletismo Olímpico</option>
          <option value="Atletismo Paralímpico">Atletismo Paralímpico</option>
          <option value="Bocha Paralímpica">Bocha Paralímpica</option>
          <option value="Basquete">Basquete</option>
          <option value="Ginástica Artística">Ginástica Artística</option>
          <option value="Goalball">Goalball</option>
          <option value="Judô">Judô</option>
          <option value="Karatê">Karatê</option>
          <option value="Luta Olímpica">Luta Olímpica</option>
          <option value="Natação">Natação</option>
          <option value="Polo Aquático">Polo Aquático</option>
          <option value="Triathlon">Triathlon</option>
          <option value="Vôlei">Vôlei</option>
          <option value="Vôlei Paralímpico">Vôlei Paralímpico</option>
        </Form.Select>
        <ErrorWrapper msg={hasError("modalidade")?.value} />
      </Col>

      {/* Input da Categoria */}
      {categorias.length > 0 && (
        <Col>
          <Form.Label name="categoria">Categoria:</Form.Label>
          <Form.Select
            autoComplete="off"
            className="form-control"
            name="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="" disabled>Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </Form.Select>
          <ErrorWrapper msg={hasError("categoria")?.value} />
        </Col>
      )}

      {/* Input da Posição */}
      {posicoes.length > 0 && (
        <Col>
          <Form.Label name="posicao">Posição:</Form.Label>
          <Form.Select
            autoComplete="off"
            className="form-control"
            name="posicao"
            value={posição}
            onChange={(e) => setPosição(e.target.value)}
          >
            <option value="" disabled>Selecione uma posição</option>
            {posicoes.map((posicao) => (
              <option key={posicao} value={posicao}>
                {posicao}
              </option>
            ))}
          </Form.Select>
          <ErrorWrapper msg={hasError("posição")?.value} />
        </Col>
      )}

        {/* Input do Sexo */}
        <Col>
          <Form.Label name="sexo">Sexo:</Form.Label>
          <Form.Select onChange={(e) => setSexo(e.target.value)}>
            <option selected disabled>Selecione uma opção</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </Form.Select>
          <ErrorWrapper msg={hasError("sexo")?.value} />
        </Col>

        {/* Input do E-MAIL */}
        <Col>
          <Form.Label name="email">E-mail:</Form.Label>
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

        {/* Input da Senha*/}
        <Col>
          <Form.Label name="senha">Senha:</Form.Label>
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

export default Atleta;