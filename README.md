# Recommendation platform


## Purpose
SaaS platform that offers a recommendations solution which businesses can use to recommend products to their customers.


## Functionalities
1. Authentication for businesses

2. Public RESTful APIs and SDK

3. Monthly and yearly subscription

4. Notification through emails

5. Recommendation engine

## System design
monorepo

frontend - React

backend - microservice architecture

elasticsearch, logstash and kibana to analyze events that goes through RabbitMQ

RabbitMQ used for event based communication

## Microservices
1. API Gateway  
- exposes API endpoints and communicates with microservices  
- stands between public and microservices


2. Authentication microservice
- postgres db with accounts and API keys
- communicates with the API Gateway through gRPC
communicates with Email microservice through events with RabbitMQ

