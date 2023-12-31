import React, { useState , useEffect } from 'react';
import { Button, Form, Container, Row } from 'react-bootstrap';
import {toast} from 'react-toastify'
import Select from 'react-select';
import '../SolicitarExame/solicitarExame.css';
import Axios from "axios"

let array_nomes = []
let array_modalidade = []
let array_cpf = []
let array_id = []

function SolicitarExame({ cpfSolicited }) {

  

  const [nome, setNome] = useState("")
  const [modalidade, setmodalidade] = useState("")
  const [cpf, setCpf] = useState(cpfSolicited)
  const [id, setId] = useState('')
  const [hbl, setHbl] = useState(true) // Habilitar o botão "Enviar"
  const [id_usable, setId_usable] = useState("")


  useEffect(() => {
    Axios.get('http://localhost:3001/medico/notSolicited')
    .then((res) =>{
        array_nomes = []
        array_modalidade = []
        array_cpf = []
        for (let x = 0; x < res.data.length; x++) {
          array_nomes.push(res['data'][x]['nome'])
          array_modalidade.push(res['data'][x]['modalidade'])
          array_cpf.push(res['data'][x]['cpf'])
          array_id.push(res['data'][x]['idatleta'])
        }
        setId(array_id)
    })
},[])


function enviar_exame(){
  let arquivo = document.getElementById("file").files[0];
  if(arquivo){
    var formData = new FormData();
    formData.append("pdfexame", arquivo);
    formData.append("id_exame_atl", id_usable);
    Axios.post('http://localhost:3001/medico/solicitarExame', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) =>{
      toast.success('Solicitado com sucesso!')
      setTimeout(() => {
        window.location.reload();
      }, "1000");
    })
  }
  else{
    toast.error("Nenhum arquivo selecionado!")
  }
}

const [buscar_cpf, setBuscarcpf] = useState(cpf)

function chamar_cpf(){
  //buscando campos
  let found_cpf = array_cpf.find(element => element === buscar_cpf);
  setCpf(found_cpf)
  let found_index = array_cpf.indexOf(buscar_cpf);
  setmodalidade(array_modalidade[found_index])
  setNome(array_nomes[found_index])
  setHbl(false)

  //buscando id

  let found_x = array_cpf.find(element => element === buscar_cpf)
  setCpf(found_x)
  let found_id = array_cpf.indexOf(buscar_cpf);
  setId_usable(array_id[found_id])
}

  return (
    <Container className='mt-5'>
      <Row className='justify-content-md-center '>
        <Form className='w-50 m-auto form '>
          <Form.Group className="mb-4" controlId="formBasicEmail">
          <Form.Label>CPF:</Form.Label>
          <div class="d-flex">
            <Form.Control type="text" placeholder="" className='mx-1' value={cpf} onChange={(e) => setBuscarcpf(e.target.value)}/>
            <Button variant="success" size="sm" onClick={chamar_cpf}>Buscar</Button>
            </div>
            <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label>Nome do Atleta: </Form.Label>
            <Form.Control type="text" placeholder="" disabled value={nome}/>
          </Form.Group>
          <Form.Group className="mb-4" controlId="formBasicCheckbox">
          </Form.Group>
          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label>Modalidade:</Form.Label>
            <Form.Control type="text" placeholder="" disabled value={modalidade}/>
          </Form.Group>
          <Form.Group className="mb-4" controlId="formBasicCheckbox">
          </Form.Group>

          <input type="file" accept="application/pdf" id="file" />
          
         
          <div className='text-center'>
            <Button variant="success mt-4" onClick={enviar_exame} disabled={hbl}>Enviar</Button>
          </div>

        </Form>
      </Row>
    </Container>
  );
}

export default SolicitarExame;