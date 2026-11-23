package com.gym.member.model;

import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "solicitacoes_inscricao")
public class SolicitacaoInscricaoEntity extends BaseEntity {

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, length = 40)
    private String telefone;

    @Column(length = 160)
    private String email;

    @Column(name = "plano_pretendido", length = 120)
    private String planoPretendido;

    @Column(length = 15)
    private String sexo;

    private Integer idade;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    // pendente | aprovado | rejeitado
    @Column(nullable = false, length = 20)
    private String status = "pendente";

    @Column(name = "revisto_por", length = 160)
    private String revistoPor;

    // preenchido quando a aprovação cria/associa um cliente
    @Column(name = "cliente_id")
    private UUID clienteId;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPlanoPretendido() { return planoPretendido; }
    public void setPlanoPretendido(String planoPretendido) { this.planoPretendido = planoPretendido; }
    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }
    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRevistoPor() { return revistoPor; }
    public void setRevistoPor(String revistoPor) { this.revistoPor = revistoPor; }
    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }
}
