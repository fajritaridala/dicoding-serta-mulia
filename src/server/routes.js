import { postPredictHandler } from './handler.js';

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        // mengisinkan data berupa gambar
        allow: 'multipart/form-data',
        multipart: true,
      },
    },
  },
];

export { routes };
