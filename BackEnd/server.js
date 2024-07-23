import express from 'express';
import { ObjectId } from 'mongodb';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';


const prisma = new PrismaClient()
const app = express();
const port = 3000;
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());


app.get('/', async (req, res) => {
    
    const products = await prisma.products.findMany();
    res.json(products);

});

app.post('/products', async (req, res) => {

    const newProduct = await prisma.products.create({
        data: {
            id: new ObjectId().toString(),  
            name: req.body.name,
            price: req.body.price,
            quant: req.body.quant
        }
    })

    res.status(201).json(newProduct);  

});

app.delete('/products/:id', async (req, res) => {

    const { id } = req.params;
    try {
      await prisma.products.delete({
        where: {
          id: id
        }
      });
      res.status(200).json({ message: 'Produto deletado' });
    } catch (error) {
      res.status(400).json({ error: 'Produto não encontrado ou ID inválido' });
    }

});

app.put('/products/:id', async (req, res) => {

    const { id } = req.params;

    try{
        const updateProduct = await prisma.products.update({
            where: { id: id},
            data:{
                name: req.body.name,
                price: req.body.price,
                quant: req.body.quant
            }
        })

        res.json(updateProduct);
    }catch{
        res.status(500).json({ error: error.message });
    }
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
