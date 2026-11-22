package com.gym.gym.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_PLANO = "plano.exchange";
    public static final String QUEUE_PLANO_EVENTOS = "plano.eventos";
    public static final String ROUTING_KEY_PLANO = "plano.#";

    public static final String EXCHANGE_NOTIFICACAO = "notificacao.exchange";
    public static final String QUEUE_NOTIFICACAO_EMAIL = "notificacao.email";
    public static final String ROUTING_KEY_NOTIFICACAO = "notificacao.#";

    @Bean
    public TopicExchange planoExchange() {
        return new TopicExchange(EXCHANGE_PLANO);
    }

    @Bean
    public Queue planoEventosQueue() {
        return QueueBuilder.durable(QUEUE_PLANO_EVENTOS).build();
    }

    @Bean
    public Binding planoBinding(Queue planoEventosQueue, TopicExchange planoExchange) {
        return BindingBuilder.bind(planoEventosQueue).to(planoExchange).with(ROUTING_KEY_PLANO);
    }

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
        return BindingBuilder.bind(notificacaoEmailQueue).to(notificacaoExchange).with(ROUTING_KEY_NOTIFICACAO);
    }

    // ─── Eventos de pagamento (gateway) ─────────────────────────
    public static final String EXCHANGE_PAGAMENTO = "pagamento.exchange";
    public static final String QUEUE_PAGAMENTO_GYM = "pagamento.gym";
    public static final String ROUTING_KEY_PAGAMENTO = "pagamento.#";

    @Bean
    public TopicExchange pagamentoExchange() {
        return new TopicExchange(EXCHANGE_PAGAMENTO);
    }

    @Bean
    public Queue pagamentoGymQueue() {
        return QueueBuilder.durable(QUEUE_PAGAMENTO_GYM).build();
    }

    @Bean
    public Binding pagamentoGymBinding(Queue pagamentoGymQueue, TopicExchange pagamentoExchange) {
        return BindingBuilder.bind(pagamentoGymQueue).to(pagamentoExchange).with(ROUTING_KEY_PAGAMENTO);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
