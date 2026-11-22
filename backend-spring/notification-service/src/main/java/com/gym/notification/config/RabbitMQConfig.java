package com.gym.notification.config;

import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Converte as mensagens JSON (publicadas por auth/gym/store) para Map nos @RabbitListener.
    // Sem isto, os listeners falham com "Cannot convert [B to Map" e NENHUM email é enviado.
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
