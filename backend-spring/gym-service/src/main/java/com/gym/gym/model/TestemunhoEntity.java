package com.gym.gym.model;

import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "testemunhos")
public class TestemunhoEntity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Column(nullable = false)
    private int stars = 5;

    @Column(nullable = false, length = 20)
    private String status = "pending";

    @Column(length = 100)
    private String cargo;

    @Column(columnDefinition = "TEXT")
    private String foto;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public int getStars() { return stars; }
    public void setStars(int stars) { this.stars = stars; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
}
