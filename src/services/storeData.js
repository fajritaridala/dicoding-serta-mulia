import { Firestore } from '@google-cloud/firestore';

const storeData = async (id, data) => {
  // databaseId -> berasal dari database dari firestore
  const db = new Firestore({ databaseId: 'serta-mulia-databases' });

  const predictCollection = db.collection('prediction');
  return predictCollection.doc(id).set(data);
};

export { storeData };
