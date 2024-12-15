async function userRoutes(fastify, options) {
    fastify.get('/welcome', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { username } = request.user;
        reply.send({ message: `Welcome, ${username}!` });
    });
}

module.exports = userRoutes;