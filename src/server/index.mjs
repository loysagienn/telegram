import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import send from 'koa-send';
import {DEVELOP_STATIC_PATH} from 'config';
import './ws';


const isProductionMode = process.env.NODE_ENV === 'production';

if (!isProductionMode) {
    const DEVELOP_STATIC_SERVER_PORT = 3232;

    const server = new Koa();

    server.use(bodyParser());

    server.use(async (ctx) => {
        const filePath = ctx.path;
        const root = DEVELOP_STATIC_PATH;

        return send(ctx, filePath, {root, index: 'index.html'});
    });

    server.listen(DEVELOP_STATIC_SERVER_PORT);

    console.log(`Start develop static server on port ${DEVELOP_STATIC_SERVER_PORT}`);
}
