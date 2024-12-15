const fastify = require('fastify')({ logger: true });
const path = require('path');
const fastifyJwt = require('@fastify/jwt');
const fastifyView = require('@fastify/view');
const books = require('./public/scripts/books.js');
fastify.register(fastifyJwt, { secret: 'supersecret' });

fastify.register(fastifyView, {
    engine: {
      ejs: require('ejs'),
    },
    root: path.join(__dirname, 'views'), 
  });

  fastify.get('/', (request, reply) => {
    reply.view('index.ejs', { title: 'Welcome' });
  });

  fastify.get('/login', (request, reply) => {
  reply.view('login.ejs', { title: 'Login' });
});

fastify.get('/register', (request, reply) => {
  reply.view('register.ejs', { title: 'Register' });
});

fastify.get('/welcome', (request, reply) => {
  reply.view('welcome.ejs', { title: 'Welcome' });
});

fastify.get('/books', (request, reply) => {
  return  reply.view('books.ejs', { books }, { title: 'books' });
  });

  fastify.get('/books/:id', (req, reply) => {
    const bookId = parseInt(req.params.id, 10); 
    const book = books.find(b => b.id === bookId);

    if (!book) {

        return reply.code(404).send('Book not found');
    }

    return reply.view('bookDetail.ejs', { book });
});

fastify.decorate('authenticate', async function(request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

fastify.register(require('@fastify/formbody'));


fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
});

fastify.register(require('./routes/auth.js'), { prefix: '/auth' });

fastify.register(require('./routes/user.js'), { prefix: '/user' });


const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: 'localhost' });
        fastify.log.info("Server is running at http://localhost:3000");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();