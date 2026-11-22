package com.gym.member.model;

import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "notificacoes")
public class NotificacaoEntity extends BaseEntity {

    @Column(name = "user_id")
    private UUID userId;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    @Column(length = 30)
    private String tipo = "info";

    @Column(nullable = false)
    private boolean lida = false;

    @Column(length = 300)
    private String link;

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public boolean isLida() { return lida; }
    public void setLida(boolean lida) { this.lida = lida; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
}
