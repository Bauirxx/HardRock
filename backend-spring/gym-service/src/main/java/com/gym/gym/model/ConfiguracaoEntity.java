package com.gym.gym.model;

import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "configuracoes")
public class ConfiguracaoEntity extends BaseEntity {

    @Column(length = 150)
    private String nome;

    @Column(length = 60)
    private String subdominio;

    @Column(length = 80)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl;

    @Column(name = "whatsapp_number", length = 30)
    private String whatsappNumber;

    @Column(length = 30)
    private String telefone;

    @Column(name = "email_notificacao", length = 150)
    private String emailNotificacao;

    @Column(columnDefinition = "TEXT")
    private String endereco;

    @Column(name = "horario_funcionamento", length = 200)
    private String horarioFuncionamento;

    @Column(name = "google_maps_embed", columnDefinition = "TEXT")
    private String googleMapsEmbed;

    @Column(length = 40)
    private String latitude;

    @Column(length = 40)
    private String longitude;

    @Column(name = "primary_color", length = 20)
    private String primaryColor;

    // Configuração SMTP (email) — editável nas Configurações
    @Column(name = "email_host", length = 120)
    private String emailHost;

    @Column(name = "email_port")
    private Integer emailPort;

    @Column(name = "email_username", length = 150)
    private String emailUsername;

    @Column(name = "email_password", length = 255)
    private String emailPassword;

    // Horário estruturado: lista de { dia, horas }
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Map<String, Object>> horarios = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "hero_images", columnDefinition = "jsonb")
    private List<Map<String, Object>> heroImages = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "redes_sociais", columnDefinition = "jsonb")
    private Map<String, Object> redesSociais = new HashMap<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Map<String, Object>> videos = new ArrayList<>();

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getSubdominio() { return subdominio; }
    public void setSubdominio(String subdominio) { this.subdominio = subdominio; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getWhatsappNumber() { return whatsappNumber; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getEmailNotificacao() { return emailNotificacao; }
    public void setEmailNotificacao(String emailNotificacao) { this.emailNotificacao = emailNotificacao; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public String getHorarioFuncionamento() { return horarioFuncionamento; }
    public void setHorarioFuncionamento(String horarioFuncionamento) { this.horarioFuncionamento = horarioFuncionamento; }
    public String getGoogleMapsEmbed() { return googleMapsEmbed; }
    public void setGoogleMapsEmbed(String googleMapsEmbed) { this.googleMapsEmbed = googleMapsEmbed; }
    public String getLatitude() { return latitude; }
    public void setLatitude(String latitude) { this.latitude = latitude; }
    public String getLongitude() { return longitude; }
    public void setLongitude(String longitude) { this.longitude = longitude; }
    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }
    public String getEmailHost() { return emailHost; }
    public void setEmailHost(String emailHost) { this.emailHost = emailHost; }
    public Integer getEmailPort() { return emailPort; }
    public void setEmailPort(Integer emailPort) { this.emailPort = emailPort; }
    public String getEmailUsername() { return emailUsername; }
    public void setEmailUsername(String emailUsername) { this.emailUsername = emailUsername; }
    public String getEmailPassword() { return emailPassword; }
    public void setEmailPassword(String emailPassword) { this.emailPassword = emailPassword; }
    public List<Map<String, Object>> getHorarios() { return horarios; }
    public void setHorarios(List<Map<String, Object>> horarios) { this.horarios = horarios != null ? horarios : new ArrayList<>(); }
    public List<Map<String, Object>> getHeroImages() { return heroImages; }
    public void setHeroImages(List<Map<String, Object>> heroImages) { this.heroImages = heroImages != null ? heroImages : new ArrayList<>(); }
    public Map<String, Object> getRedesSociais() { return redesSociais; }
    public void setRedesSociais(Map<String, Object> redesSociais) { this.redesSociais = redesSociais != null ? redesSociais : new HashMap<>(); }
    public List<Map<String, Object>> getVideos() { return videos; }
    public void setVideos(List<Map<String, Object>> videos) { this.videos = videos != null ? videos : new ArrayList<>(); }
}
