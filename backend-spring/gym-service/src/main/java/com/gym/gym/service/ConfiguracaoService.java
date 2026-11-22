package com.gym.gym.service;

import com.gym.common.exception.ResourceNotFoundException;
import com.gym.gym.dto.*;
import com.gym.gym.model.ConfiguracaoEntity;
import com.gym.gym.repository.ConfiguracaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ConfiguracaoService {

    private final ConfiguracaoRepository repository;

    public ConfiguracaoService(ConfiguracaoRepository repository) {
        this.repository = repository;
    }

    public Page<ConfiguracaoDTO> listar(Pageable pageable) {
        return repository.findAll(pageable).map(ConfiguracaoDTO::from);
    }

    public ConfiguracaoDTO buscarPorId(UUID id) {
        return ConfiguracaoDTO.from(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Configuração", id)));
    }

    @Transactional
    public ConfiguracaoDTO criar(CreateConfiguracaoDTO dto) {
        ConfiguracaoEntity c = new ConfiguracaoEntity();
        aplicar(c, dto);
        return ConfiguracaoDTO.from(repository.save(c));
    }

    @Transactional
    public ConfiguracaoDTO actualizar(UUID id, CreateConfiguracaoDTO dto) {
        ConfiguracaoEntity c = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Configuração", id));
        aplicar(c, dto);
        return ConfiguracaoDTO.from(repository.save(c));
    }

    private void aplicar(ConfiguracaoEntity c, CreateConfiguracaoDTO dto) {
        if (dto.nome() != null) c.setNome(dto.nome());
        if (dto.subdominio() != null) c.setSubdominio(dto.subdominio());
        if (dto.slug() != null) c.setSlug(dto.slug());
        if (dto.descricao() != null) c.setDescricao(dto.descricao());
        if (dto.logoUrl() != null) c.setLogoUrl(dto.logoUrl());
        if (dto.whatsappNumber() != null) c.setWhatsappNumber(dto.whatsappNumber());
        if (dto.telefone() != null) c.setTelefone(dto.telefone());
        if (dto.emailNotificacao() != null) c.setEmailNotificacao(dto.emailNotificacao());
        if (dto.endereco() != null) c.setEndereco(dto.endereco());
        if (dto.horarioFuncionamento() != null) c.setHorarioFuncionamento(dto.horarioFuncionamento());
        if (dto.googleMapsEmbed() != null) c.setGoogleMapsEmbed(dto.googleMapsEmbed());
        if (dto.latitude() != null) c.setLatitude(dto.latitude());
        if (dto.longitude() != null) c.setLongitude(dto.longitude());
        if (dto.primaryColor() != null) c.setPrimaryColor(dto.primaryColor());
        if (dto.emailHost() != null) c.setEmailHost(dto.emailHost());
        if (dto.emailPort() != null) c.setEmailPort(dto.emailPort());
        if (dto.emailUsername() != null) c.setEmailUsername(dto.emailUsername());
        // Só actualiza a password se veio uma nova (não vazia) — senão mantém a actual
        if (dto.emailPassword() != null && !dto.emailPassword().isBlank()) c.setEmailPassword(dto.emailPassword());
        if (dto.horarios() != null) c.setHorarios(dto.horarios());
        if (dto.heroImages() != null) c.setHeroImages(dto.heroImages());
        if (dto.redesSociais() != null) c.setRedesSociais(dto.redesSociais());
        if (dto.videos() != null) c.setVideos(dto.videos());
    }
}
