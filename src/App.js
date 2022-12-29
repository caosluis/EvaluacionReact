import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Component } from 'react'
import axios from 'axios'
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap"
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'

class test extends Component {

  constructor(props) {
    super(props)
    /* const [startDate, setStartDate] = useState(new Date()); */
    this.state = {
      todos: [],
      modalActualizar: false,
      modalInsertar: false,
      form: {
        Tarea: "",
        Estado: "",
        Fecha: new Date(),
      },
    }
  }

  componentDidMount() {
    this.cargarDatos()
  }
  render() {
    const { todos = [] } = this.state
    const options = [
      { value: 'Realizado', label: 'Realizado' },
      { value: 'No Realizado', label: 'No Realizado' }
    ]
    return (
      <>
        <Container>
          <br />
          <Button color="primary" onClick={() => this.mostrarModalInsertar()}>Crear Nueva Tarea</Button>
          <br />
          <br />
          <Table>
            <thead>
              <tr>
                <th>
                  Tarea
                </th>
                <th>
                  Estado
                </th>
                <th>
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {todos.length ?
                todos.map(todo => (
                  <tr key={todo._id}>
                    <td>{todo.Tarea}</td>
                    <td>{todo.Estado}</td>
                    <td>{moment(todo.Fecha).format('MM/DD/YYYY')}</td>
                    <td><Button color="danger" onClick={() => this.eliminar(todo)}>Eliminar</Button>
                      <Button
                        color="primary"
                        onClick={() => this.mostrarModalActualizar(todo)}
                      >
                        Editar
                      </Button></td>

                  </tr>
                ))
                :
                (<tr>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>)
              }
            </tbody>
          </Table>
        </Container>


        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div><h3>Crear Nueva Tarea</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
                Tarea:
              </label>

              <input
                className="form-control"
                name="Tarea"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Estado:
              </label>
              <Select
                name="Estado" options={options} onChange={this.handleChangeSelect} />

            </FormGroup>

            <FormGroup>
              <label>
                Fecha:
              </label>
              <DatePicker selected={new Date(this.state.form.Fecha)} onChange={this.handleChangeDatePicker} />

            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.insertar()}
            >
              Insertar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={() => this.cerrarModalInsertar()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalActualizar}>
          <ModalHeader>
            <div><h3>Editar Registro</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
                Tarea:
              </label>

              <input
                className="form-control"
                name="Tarea"
                type="text"
                value={this.state.form.Tarea}
                onChange={this.handleChange}
              />

            </FormGroup>

            <FormGroup>
              <label>
                Estado:
              </label>
              <Select
                value={{ value: this.state.form.Estado, label: this.state.form.Estado }}
                name="Estado" options={options} onChange={this.handleChangeSelect} />
            </FormGroup>

            <FormGroup>
              <label>
                Fecha:
              </label>

              <DatePicker selected={new Date(this.state.form.Fecha)} onChange={this.handleChangeDatePicker} />

            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.editar(this.state.form)}
            >
              Editar
            </Button>
            <Button
              color="danger"
              onClick={() => this.cerrarModalActualizar()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
  cargarDatos() {
    axios.get("http://localhost:9000/api/tareas")
      .then(response => {
        this.setState({
          todos: response.data
        })
      })
  }
  eliminar = async (tarea) => {
    const opcion = window.confirm(`Está seguro de eliminar la tarea ${tarea.Tarea}`)
    if (opcion) {
      await axios.delete(`http://localhost:9000/api/tareas/${tarea._id}`).then(response => {
        console.log(response.data)
      })

      await axios.get("http://localhost:9000/api/tareas")
        .then(response => {
          this.setState({
            todos: response.data
          })
        })
    }
  }

  insertar = async () => {
    if (this.state.form.Estado === '') {
      this.state.form.Estado = 'No Realizado'
    }
    await axios.post("http://localhost:9000/api/tareas", this.state.form)
      .then(response => {
        this.setState({
          todos: response.data
        })
      })
    this.setState({
      modalInsertar: false,
    })
    this.cargarDatos()
  }

  editar = async (tarea) => {
    await axios.put(`http://localhost:9000/api/tareas/${tarea._id}`, this.state.form)
      .then(response => {
        this.setState({
          todos: response.data
        })
      })
    this.setState({
      modalActualizar: false,
    })
    this.cargarDatos()
  }

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    })
  }
  handleChangeSelect = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        Estado: e.value
      }
    })
  }

  handleChangeDatePicker = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        Fecha: e
      }
    })
  }

  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
    })
  }

  mostrarModalActualizar = (tarea) => {
    this.setState({
      form: tarea,
      modalActualizar: true,
    })
  }

  cerrarModalInsertar = () => {
    this.setState({ modalInsertar: false })
  }

  cerrarModalActualizar = () => {
    this.setState({ modalActualizar: false })
  }
}

export default test
