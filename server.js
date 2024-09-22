const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Sample data
let users = [];
let posts = [];
let comments = [];
let clients = [];

// Clients API routes
app.post('/api/clients', (req, res) => {
    const newClient = {
        id: clients.length + 1, // Simple ID assignment
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    };

    clients.push(newClient);
    res.status(201).json(newClient);
});

// PATCH route to update client details
app.patch('/api/clients/:id', (req, res) => {
    const clientId = parseInt(req.params.id);
    const client = clients.find(c => c.id === clientId);

    if (!client) {
        return res.status(404).send('Client not found.');
    }

    // Update client properties if provided in the request body
    if (req.body.name) client.name = req.body.name;
    if (req.body.email) client.email = req.body.email;
    if (req.body.phone) client.phone = req.body.phone;

    res.json(client);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! Please try again later.');
});

app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.render('index', { clients });
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/clients', (req, res) => {
    const newClient = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        inif: req.body.inif
    };
    clients.push(newClient);

    // Redirect to the homepage to show updated client list
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Example route to render a view
app.get('/', (req, res) => {
    const clients = [
        { name: 'Alice', email: 'alice@example.com', phone: '555-1234', inif: 'INIF001' },
        { name: 'Bob', email: 'bob@example.com', phone: '555-5678', inif: 'INIF002' }
    ];
    
    res.render('index', { clients });
});

app.post('/clients', (req, res) => {
    const newClient = new Client(req.body);
    newClient.save()
        .then(client => res.status(201).json(client)) // Respond with the new client data
        .catch(err => res.status(500).send(err));
});

// DELETE client by ID
app.delete('/clients/:id', (req, res) => {
    Client.findByIdAndDelete(req.params.id)
        .then(result => {
            if (!result) {
                return res.status(404).send('Client not found');
            }
            res.status(200).json({ message: 'Client deleted successfully' });
        })
        .catch(err => res.status(500).send('Error deleting client: ' + err));
});

