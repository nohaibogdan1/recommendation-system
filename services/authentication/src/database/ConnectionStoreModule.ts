import {Module }from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";

@Module({
    providers: [{
        provide: "ConnectionStore",
        useValue: new AsyncLocalStorage()
    }],
    exports: ["ConnectionStore"]
})
export default class ConnectionStoreModule {}