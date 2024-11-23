import { predictClassification } from '../services/inferenceService.js';
import { storeData } from "../services/storeData.js";

const postPredictHandler = async (request, h) => {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { confidenceScore, label, explanation, suggestion } =
    await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,
    explanation,
    suggestion,
    confidenceScore,
    createdAt,
  };

  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message:
      confidenceScore > 99
        ? 'Model is predicted successfully.'
        : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data,
  });

  response.code(201);
  return response;
};

export { postPredictHandler };
