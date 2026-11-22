package com.gym.gym.dto;

import com.gym.gym.model.ConfiguracaoEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record ConfiguracaoDTO(
    UUID id, String nome, String subdominio, String slug, String descricao, String logoUrl,
    String whatsappNumber, String telefone, String emailNotificacao,
    String endereco, String horarioFuncionamento, String googleMapsEmbed,
    String latitude, String longitude, String primaryColor,
    String emailHost, Integer emailPort, String emailUsername, Boolean emailConfigured,
    List<Map<String, Object>> horarios,
    List<Map<String, Object>> heroImages, Map<String, Object> redesSociais,
    List<Map<String, Object>> videos, boolean activo, LocalDateTime dataCriacao
) {
    public static ConfiguracaoDTO from(ConfiguracaoEntity c) {
        return new ConfiguracaoDTO(
            c.getId(), c.getNome(), c.getSubdominio(), c.getSlug(), c.getDescricao(), c.getLogoUrl(),
            c.getWhatsappNumber(), c.getTelefone(), c.getEmailNotificacao(),
            c.getEndereco(), c.getHorarioFuncionamento(), c.getGoogleMapsEmbed(),
            c.getLatitude(), c.getLongitude(), c.getPrimaryColor(),
            c.getEmailHost(), c.getEmailPort(), c.getEmailUsername(),
            // Nunca devolve a password; expõe apenas se está configurado
            c.getEmailPassword() != null && !c.getEmailPassword().isBlank(),
            c.getHorarios(), c.getHeroImages(), c.getRedesSociais(), c.getVideos(),
            c.isActivo(), c.getDataCriacao()
        );
    }
}
