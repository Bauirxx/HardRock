package com.gym.member.model;

import com.gym.common.enums.EstadoCivil;
import com.gym.common.enums.Sexo;
import com.gym.common.enums.TipoCliente;
import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "clientes")
public class ClienteEntity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "numero_telefone", nullable = false, length = 20)
    private String numeroTelefone;

    @Column(columnDefinition = "TEXT")
    private String foto;

    @Column(name = "bilhete_identidade", length = 30, unique = true)
    private String bilheteIdentidade;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_civil", length = 15)
    private EstadoCivil estadoCivil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private Sexo sexo;

    @Column(name = "numero_familiar", length = 20)
    private String numeroFamiliar;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_cliente", nullable = false, length = 10)
    private TipoCliente tipoCliente;

    @Column(name = "servico_atrelado", length = 50)
    private String servicoAtrelado;

    @Column(name = "data_admissao")
    private LocalDate dataAdmissao;

    @Column(name = "personal_trainer_id")
    private UUID personalTrainerId;

    @Column(name = "user_id")
    private UUID userId;

    // ─── Campos ricos usados pelo frontend (ficha do cliente) ───
    @Column(length = 150)
    private String email;

    private Integer idade;

    @Column(length = 255)
    private String endereco;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @Column(name = "plano_atual", length = 100)
    private String planoAtual;

    @Column(name = "historico_doencas", columnDefinition = "TEXT")
    private String historicoDoencas;

    @Column(name = "praticava_exercicios", nullable = false)
    private boolean praticavaExercicios = false;

    @Column(name = "detalhes_exercicios", columnDefinition = "TEXT")
    private String detalhesExercicios;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getNumeroTelefone() { return numeroTelefone; }
    public void setNumeroTelefone(String numeroTelefone) { this.numeroTelefone = numeroTelefone; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public String getBilheteIdentidade() { return bilheteIdentidade; }
    public void setBilheteIdentidade(String bilheteIdentidade) { this.bilheteIdentidade = bilheteIdentidade; }
    public EstadoCivil getEstadoCivil() { return estadoCivil; }
    public void setEstadoCivil(EstadoCivil estadoCivil) { this.estadoCivil = estadoCivil; }
    public Sexo getSexo() { return sexo; }
    public void setSexo(Sexo sexo) { this.sexo = sexo; }
    public String getNumeroFamiliar() { return numeroFamiliar; }
    public void setNumeroFamiliar(String numeroFamiliar) { this.numeroFamiliar = numeroFamiliar; }
    public TipoCliente getTipoCliente() { return tipoCliente; }
    public void setTipoCliente(TipoCliente tipoCliente) { this.tipoCliente = tipoCliente; }
    public String getServicoAtrelado() { return servicoAtrelado; }
    public void setServicoAtrelado(String servicoAtrelado) { this.servicoAtrelado = servicoAtrelado; }
    public LocalDate getDataAdmissao() { return dataAdmissao; }
    public void setDataAdmissao(LocalDate dataAdmissao) { this.dataAdmissao = dataAdmissao; }
    public UUID getPersonalTrainerId() { return personalTrainerId; }
    public void setPersonalTrainerId(UUID personalTrainerId) { this.personalTrainerId = personalTrainerId; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public String getPlanoAtual() { return planoAtual; }
    public void setPlanoAtual(String planoAtual) { this.planoAtual = planoAtual; }
    public String getHistoricoDoencas() { return historicoDoencas; }
    public void setHistoricoDoencas(String historicoDoencas) { this.historicoDoencas = historicoDoencas; }
    public boolean isPraticavaExercicios() { return praticavaExercicios; }
    public void setPraticavaExercicios(boolean praticavaExercicios) { this.praticavaExercicios = praticavaExercicios; }
    public String getDetalhesExercicios() { return detalhesExercicios; }
    public void setDetalhesExercicios(String detalhesExercicios) { this.detalhesExercicios = detalhesExercicios; }
}
