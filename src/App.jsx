import './App.css'
import { useState ,useRef, useEffect} from 'react'
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete,MdCancel } from "react-icons/md";
import api from '../services/api';

function App() {

let [produtos, SetProdutos] = useState([]);  

const inputName = useRef(null)
const inputPrice = useRef(null)
const inputQuant = useRef(null)

/* GET */

useEffect(() => {

  const GetProdutos = async () => {
      try {
          const response = await api.get('/');
          SetProdutos(response.data);
      } catch (error) {
          console.error('Erro ao buscar produtos:', error);
      }
  };

  GetProdutos();
}, []);

/* POST */

  async function addProduct() {

    if (
      inputName.current.value === null || inputName.current.value === '' ||
      inputPrice.current.value === null || inputPrice.current.value === '' ||
      inputQuant.current.value === null || inputQuant.current.value === ''
    ) {
      console.error('Nenhum dos campos pode estar vazio');
      alert("Preencha todos os campos!")
    } else {
      try {
        const newProduct = await api.post('/products', {
          name: inputName.current.value,
          price: parseFloat(inputPrice.current.value),
          quant: parseInt(inputQuant.current.value, 10)
        });
        GetProdutos();
        console.log('Produto adicionado:', newProduct.data);

      } catch (error) {
        console.error('Houve um erro ao adicionar o produto:', error);
      }
    }
  }



/* DELETE */

async function DeleteProduct(productId) {
  try {

    await api.delete(`/products/${productId}`);
    console.log('Produto deletado com sucesso');
    SetProdutos(produtos.filter(product => product.id !== productId));
    GetProdutos();

  } catch (error) {
    console.error('Erro ao deletar o produto:', error);
  }
}

/* PUT */

let updateName = useRef(null)
let updatePrice = useRef(null)
let updateQuant = useRef(null)
const [updateId, setUpdateId] = useState(null);
const [name, setName] = useState(null)
const [price, setPrice] = useState(null)
const [quant, setQuant] = useState(null)

function UpdateToggle(productId,name,price,quant)  {

  const updateForm = document.getElementById('update-form');
  updateForm.style.display = (updateForm.style.display === 'none') ? 'block' : 'none';

  setUpdateId(productId);
  setName(name);
  setPrice(price);
  setQuant(quant);
}

async function UpdateProduct(productId) {

  if (updateName.current.value === null || updateName.current.value === '') {
    updateName = name;
  } else {
    updateName = updateName.current.value;
  }

  if (updatePrice.current.value === null || updatePrice.current.value === '') {
    updatePrice = price;
  } else {
    updatePrice = updatePrice.current.value;
  }

  if (updateQuant.current.value === null || updateQuant.current.value === '') {
    updateQuant = quant;
  } else {
    updateQuant = updateQuant.current.value;
  }


  await api.put(`/products/${productId}`, {
    name: updateName,
    price: parseFloat(updatePrice),
    quant: parseInt(updateQuant)
  });

  GetProdutos();
}

  return (
    <div className="container">

      <form className='addForm'>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Quantidade</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td><input type="text" placeholder='Nome' id='name' ref={inputName}/></td>
              <td><input type="text" placeholder='Preço' id='price' ref={inputPrice}/></td>
              <td><input type="number" min="0" placeholder='Quantidade' id='quant' ref={inputQuant}/></td>
              <td><button onClick={addProduct}>add</button></td>
            </tr>
          </tbody>
        </table>
      </form>

      <div className='productsContainer'>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Excluir</th>
              <th>Editar</th>
            </tr>
          </thead>

          <tbody>

          
            {produtos.map((produto) => (
              <tr key={produto.id} className='products'>
                <td>{produto.name}</td>
                <td>{produto.price}</td>
                <td>{produto.quant}</td>
                <td><button onClick={() => UpdateToggle(produto.id,produto.name,produto.price,produto.quant)}><MdOutlineEdit /></button></td>
                <td><button onClick={() => DeleteProduct(produto.id)}><MdDelete></MdDelete></button></td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
      
      <form id='update-form'>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Quantidade</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td><input type="text" placeholder='Nome' id='name' ref={updateName}/></td>
              <td><input type="text" placeholder='Preço' id='price' ref={updatePrice}/></td>
              <td><input type="number" min="0" placeholder='Quantidade' id='quant' ref={updateQuant}/></td>
              <td><button onClick={ () => UpdateProduct(updateId)}>add</button></td>
              <td><button><MdCancel /></button></td>
            </tr>
          </tbody>
        </table>
      </form>

    </div>
  )
}

export default App
