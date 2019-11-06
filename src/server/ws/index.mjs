import wsServer from './server';
import initConnection from './initConnection';


wsServer.on('connection', initConnection);
