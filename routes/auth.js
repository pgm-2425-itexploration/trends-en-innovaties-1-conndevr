const bcrypt = require('bcryptjs');

async function authRoutes(fastify, options) {

    const users = new Map();

    fastify.post('/register', {
        schema: {
            body: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string', minLength: 3 },
                    password: { type: 'string', minLength: 6 },
                },
            },
        },
    },
    
    async (request, reply) => {
        const { username, password } = request.body;

        if (users.has(username)) {
            return reply.code(400).send({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.set(username, { username, password: hashedPassword });

        reply.send({ message: 'User registered successfully' });
    });

    // Loginroute
    fastify.post('/login', {
        schema: {
            body: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                },
            },
        },
    }, 
    
    async (request, reply) => {
        const { username, password } = request.body;

        const user = users.get(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return reply.code(401).send({ error: 'Invalid username or password' });
        }

        const token = fastify.jwt.sign({ username });
        reply.send({ token });
    });
}

module.exports = authRoutes;
