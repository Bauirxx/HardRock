package com.gym.member.model;

import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "leads")
public class LeadEntity extends BaseEntity {

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(length = 30)
    private String telefone;

    @Column(length = 150)
    private String email;

    @Column(length = 60)
    private String interesse;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    @Column(length = 40)
    private String fonte;

    @Column(nullable = false, length = 20)
    private String status = "novo";

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getInteresse() { return interesse; }
    public void setInteresse(String interesse) { this.interesse = interesse; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    public String getFonte() { return fonte; }
    public void setFonte(String fonte) { this.fonte = fonte; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
