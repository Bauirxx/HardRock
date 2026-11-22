package com.gym.store.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Converte as mensagens JSON (publicadas pelo payment-service) para Map no @RabbitListener
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    public static final String EXCHANGE_PAGAMENTO = "pagamento.exchange";
    public static final String QUEUE_PAGAMENTO_STORE = "pagamento.store";
    public static final String ROUTING_PAGAMENTO = "pagamento.#";

    @Bean
    public TopicExchange pagamentoExchange() {
        return new TopicExchange(EXCHANGE_PAGAMENTO);
    }

    @Bean
    public Queue pagamentoStoreQueue() {
        return QueueBuilder.durable(QUEUE_PAGAMENTO_STORE).build();
    }

    @Bean
    public Binding pagamentoStoreBinding(Queue pagamentoStoreQueue, TopicExchange pagamentoExchange) {
        return BindingBuilder.bind(pagamentoStoreQueue).to(pagamentoExchange).with(ROUTING_PAGAMENTO);
    }
}
