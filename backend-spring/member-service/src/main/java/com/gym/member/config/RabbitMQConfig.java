package com.gym.member.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_CLIENTE = "cliente.exchange";
    public static final String QUEUE_CLIENTE_EVENTOS = "cliente.eventos";
    public static final String ROUTING_KEY_CLIENTE = "cliente.#";

    @Bean
    public TopicExchange clienteExchange() {
        return new TopicExchange(EXCHANGE_CLIENTE);
    }

    @Bean
    public Queue clienteEventosQueue() {
        return QueueBuilder.durable(QUEUE_CLIENTE_EVENTOS).build();
    }

    @Bean
    public Binding clienteBinding(Queue clienteEventosQueue, TopicExchange clienteExchange) {
        return BindingBuilder.bind(clienteEventosQueue).to(clienteExchange).with(ROUTING_KEY_CLIENTE);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
