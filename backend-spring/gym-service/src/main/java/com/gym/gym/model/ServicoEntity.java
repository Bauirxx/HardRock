package com.gym.gym.model;

import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "servicos")
public class ServicoEntity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "preco_mensal", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoMensal;

    @Column(name = "preco_trimestral", precision = 10, scale = 2)
    private BigDecimal precoTrimestral;

    @Column(name = "preco_anual", precision = 10, scale = 2)
    private BigDecimal precoAnual;

    @Column(name = "duracao_sessao")
    private Integer duracaoSessao;

    @Column(name = "sessoes_semanais")
    private Integer sessoesSemanais;

    @Column(name = "max_alunos")
    private Integer maxAlunos;

    @Column(name = "inclui_pt", nullable = false)
    private boolean incluiPt = false;

    @Column(nullable = false)
    private boolean destaque = false;

    @Column(length = 20)
    private String cor;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "servico_beneficios", joinColumns = @JoinColumn(name = "servico_id"))
    @Column(name = "beneficio", length = 255)
    private List<String> beneficios = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "servico_horarios", joinColumns = @JoinColumn(name = "servico_id"))
    @Column(name = "horario", length = 255)
    private List<String> horarios = new ArrayList<>();

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public BigDecimal getPrecoMensal() { return precoMensal; }
    public void setPrecoMensal(BigDecimal precoMensal) { this.precoMensal = precoMensal; }
    public BigDecimal getPrecoTrimestral() { return precoTrimestral; }
    public void setPrecoTrimestral(BigDecimal precoTrimestral) { this.precoTrimestral = precoTrimestral; }
    public BigDecimal getPrecoAnual() { return precoAnual; }
    public void setPrecoAnual(BigDecimal precoAnual) { this.precoAnual = precoAnual; }
    public Integer getDuracaoSessao() { return duracaoSessao; }
    public void setDuracaoSessao(Integer duracaoSessao) { this.duracaoSessao = duracaoSessao; }
    public Integer getSessoesSemanais() { return sessoesSemanais; }
    public void setSessoesSemanais(Integer sessoesSemanais) { this.sessoesSemanais = sessoesSemanais; }
    public Integer getMaxAlunos() { return maxAlunos; }
    public void setMaxAlunos(Integer maxAlunos) { this.maxAlunos = maxAlunos; }
    public boolean isIncluiPt() { return incluiPt; }
    public void setIncluiPt(boolean incluiPt) { this.incluiPt = incluiPt; }
    public boolean isDestaque() { return destaque; }
    public void setDestaque(boolean destaque) { this.destaque = destaque; }
    public String getCor() { return cor; }
    public void setCor(String cor) { this.cor = cor; }
    public List<String> getBeneficios() { return beneficios; }
    public void setBeneficios(List<String> beneficios) { this.beneficios = beneficios != null ? beneficios : new ArrayList<>(); }
    public List<String> getHorarios() { return horarios; }
    public void setHorarios(List<String> horarios) { this.horarios = horarios != null ? horarios : new ArrayList<>(); }
}
