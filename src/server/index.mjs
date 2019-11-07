import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import send from 'koa-send';
import './ws';
// import sendFile from './sendFile';


console.log('i am server');

const isProductionMode = process.env.NODE_ENV === 'production';

const server = new Koa();

server.use(bodyParser());

// server.use(async (ctx, next) => {
//     if (ctx.host === 'static.telegram.wweb.pro') {
//         return sendFile(ctx);
//     }

//     return next();
// });

if (!isProductionMode) {
    server.use(async (ctx) => {
        const filePath = ctx.path;
        const root = '/Users/vajs/projects/tg/static';

        return send(ctx, filePath, {root, index: 'index.html'});
    });
}

server.listen(3232);
