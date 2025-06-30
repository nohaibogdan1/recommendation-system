"use strict";
/**
 *
 * The purpose of this service:
 * handles authentication for tenants
 * has the required tables
 * offers API keys
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = __importDefault(require("./app.module"));
const path_1 = __importDefault(require("path"));
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.default);
        app.connectMicroservice({
            transport: microservices_1.Transport.GRPC,
            options: {
                package: "hero",
                protoPath: path_1.default.join(__dirname, "./hero/hero.proto"),
            }
        });
        yield app.startAllMicroservices();
        yield app.listen(3001);
    });
}
bootstrap();
