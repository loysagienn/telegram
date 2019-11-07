import {createReadStream} from 'fs';
import activeConnections from './ws/activeConnections';


const sendFile = async (ctx) => {
    const [, userHash, fileIdStr] = ctx.path.split('/');

    if (!userHash || !fileIdStr) {
        return;
    }

    const fileId = Number(fileIdStr);

    if (Number.isNaN(fileId)) {
        return;
    }

    const connection = activeConnections[userHash];

    if (!connection) {
        return;
    }

    console.log('fileId', fileId);

    const result = await connection.store.airgram.api.downloadFile({
        fileId,
        priority: 10,
        limit: 0,
        synchronous: true,
    });

    // const file = createReadStream(result.response.local.path);

    // ctx.body = file;
};

export default sendFile;
