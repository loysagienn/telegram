import path from 'path';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import send from 'koa-send';
import './ws';


console.log('i am server');

const server = new Koa();

server.use(bodyParser());

server.use(async (ctx) => {
    const filePath = ctx.path;
    const root = '/Users/vajs/projects/tg/static';

    return send(ctx, filePath, {root, index: 'index.html'});
});

server.listen(3232);
