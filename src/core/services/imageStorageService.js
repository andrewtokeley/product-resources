import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from '@/core/services/firebaseInit';

export { getPersistentLink }

const storage = getStorage(app);

const getPersistentLink = async function(path) {
  const reference = ref(storage, `images/${path}`);
  let result = await getDownloadURL(reference);
  return result; 
}
