package com.gym.auth.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NOTIFICACAO = "notificacao.exchange";
    public static final String QUEUE_NOTIFICACAO_EMAIL = "notificacao.email";

    @Bean
    public TopicExchange notificacaoExchange() {
        return new TopicExchange(EXCHANGE_NOTIFICACAO);
    }

    @Bean
    public Queue notificacaoEmailQueue() {
        return QueueBuilder.durable(QUEUE_NOTIFICACAO_EMAIL).build();
    }

    @Bean
    public Binding notificacaoBinding(Queue notificacaoEmailQueue, TopicExchange notificacaoExchange) {
        return BindingBuilder.bind(notificacaoEmailQueue).to(notificacaoExchange).with("notificacao.#");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
