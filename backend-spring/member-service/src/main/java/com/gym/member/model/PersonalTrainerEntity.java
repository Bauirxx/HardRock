package com.gym.member.model;

import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "personal_trainers")
public class PersonalTrainerEntity extends BaseEntity {

    @Column(name = "utilizador_id", nullable = false, unique = true)
    private UUID utilizadorId;

    @Column(nullable = false, length = 100)
    private String nome;

    @ElementCollection
    @CollectionTable(name = "pt_especialidades", joinColumns = @JoinColumn(name = "pt_id"))
    @Column(name = "especialidade", length = 50)
    private List<String> especialidades = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "pt_certificacoes", joinColumns = @JoinColumn(name = "pt_id"))
    @Column(name = "certificacao", length = 100)
    private List<String> certificacoes = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String foto;

    @Column(length = 20)
    private String telefone;

    public UUID getUtilizadorId() { return utilizadorId; }
    public void setUtilizadorId(UUID utilizadorId) { this.utilizadorId = utilizadorId; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public List<String> getEspecialidades() { return especialidades; }
    public void setEspecialidades(List<String> especialidades) { this.especialidades = especialidades; }
    public List<String> getCertificacoes() { return certificacoes; }
    public void setCertificacoes(List<String> certificacoes) { this.certificacoes = certificacoes; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
}
