package com.gym.gym.model;

import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "transformacoes")
public class TransformacaoEntity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String antes;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String depois;

    @Column(length = 50)
    private String tempo;

    @Column(columnDefinition = "TEXT")
    private String resultado;

    @Column(nullable = false)
    private int ordem = 0;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getAntes() { return antes; }
    public void setAntes(String antes) { this.antes = antes; }
    public String getDepois() { return depois; }
    public void setDepois(String depois) { this.depois = depois; }
    public String getTempo() { return tempo; }
    public void setTempo(String tempo) { this.tempo = tempo; }
    public String getResultado() { return resultado; }
    public void setResultado(String resultado) { this.resultado = resultado; }
    public int getOrdem() { return ordem; }
    public void setOrdem(int ordem) { this.ordem = ordem; }
}
