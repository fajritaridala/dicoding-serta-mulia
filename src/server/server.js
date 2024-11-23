import 'dotenv/config';

import Hapi from '@hapi/hapi';
import { routes } from './routes.js';
import { loadModel } from '../services/loadModel.js';
import { InputError } from '../exceptions/InputError.js';

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0',
    routes: {
      cors: { origin: ['*'] },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  /**
   * @param server.ext() => bertugas menangani  extension dalam Hapi
   * @param onPreResponse => extension dalam Hapi
   * @param isBoom => menghasilkan boolean true jika terjadi error pada response, dan false jika tidak.
   */
  server.route(routes);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response instanceof InputError) {
      const newResponse = h.response({
        status: 'fail',
        message: `${response.message} please use another image!`,
      });
      newResponse.code(response.output.statusCode);
      return newResponse;
    }
    if (response.isBoom) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.output.statusCode); // error disini
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
