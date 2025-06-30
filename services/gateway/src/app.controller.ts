import {Controller, Get, Inject, OnModuleInit } from "@nestjs/common";
import {ClientGrpcProxy} from "@nestjs/microservices";
import { Observable } from "rxjs";

interface HeroesService {
  findOne(data: { id: number }): Observable<any>;
}

@Controller("hero")
export default class AppController implements OnModuleInit {
    private heroesService: HeroesService;

    constructor(@Inject("HERO_PACKAGE") private readonly heroGrpc: ClientGrpcProxy){}
    
    onModuleInit() {
        this.heroesService = this.heroGrpc.getService<HeroesService>("HeroesService");
    }
    
    @Get()
    getHero() {
        this.heroesService.findOne({id: 5}).forEach(a => console.log("a", a))
    }
}