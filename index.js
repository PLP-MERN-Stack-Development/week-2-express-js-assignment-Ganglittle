const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.json());

let products = [
   {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send (`Head to http://localhost:${PORT}/api to find a product.`)
}
)
app.get('/api/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

app.get('/api/products', (req, res) => {
  res.json(products);;
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(400).json({ error: 'Product not found' });
  }

  res.json(product);;
});


app.post('/api/products', (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || price === undefined) {
    return res.status(402).json({ error: 'Name and price are required' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description: description || '',
    price,
    category: category || 'misc',
    inStock: inStock !== undefined ? inStock : true
  };

  products.push(newProduct);
  
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, description, price, category, inStock } = req.body;

  if (name) product.name = name;
  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (category) product.category = category;
  if (inStock !== undefined) product.inStock = inStock;

  res.json(product);
});


app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(index, 1);

  res.json({ message: 'Product deleted' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; 