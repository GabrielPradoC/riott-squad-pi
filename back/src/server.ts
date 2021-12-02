// Library
import { App, Logger } from './library';

// Config
import { dbConfig } from './config/database';
import { swaggerConfig } from './config/swagger';

// Endpoints
import { UserController } from './modules/users/v1';
import { LoginController } from './modules/authentication/v1';
import { ChildController } from './modules/members/v1';
import { TaskController } from './modules/tasks/v1';
import { TaskListController } from './modules/taskLists/v1';

const app: App = new App({
    port: Number(process.env.PORT || 8080),
    controllers: [UserController, LoginController, ChildController, TaskController, TaskListController],
    middlewares: [Logger.middleware],
    logger: new Logger(),
    swaggerOptions: process.env.NODE_ENV === 'development' ? swaggerConfig : undefined,
    dbConfig
});

app.start();
