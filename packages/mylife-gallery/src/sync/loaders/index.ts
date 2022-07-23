import { processImage } from './image';
import { processVideo } from './video';

export async function processFileWithLoader(type, content, documentPath) {
  switch (type) {
    case 'image':
      return await processImage(content, documentPath);

    case 'video':
      return await processVideo(content, documentPath);
  }
}
