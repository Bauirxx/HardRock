package com.gym.gym.dto;

import java.util.List;
import java.util.Map;

public record CreateConfiguracaoDTO(
    String nome, String subdominio, String slug, String descricao, String logoUrl,
    String whatsappNumber, String telefone, String emailNotificacao,
    String endereco, String horarioFuncionamento, String googleMapsEmbed,
    String latitude, String longitude, String primaryColor,
    String emailHost, Integer emailPort, String emailUsername, String emailPassword,
    List<Map<String, Object>> horarios,
    List<Map<String, Object>> heroImages, Map<String, Object> redesSociais,
    List<Map<String, Object>> videos
) {}
