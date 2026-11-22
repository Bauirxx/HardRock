package com.gym.payment.model;

import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transacoes")
public class TransacaoEntity extends BaseEntity {

    // Referência única enviada ao PaySuite (também nosso identificador de negócio)
    @Column(nullable = false, unique = true, length = 50)
    private String referencia;

    // ID da transação no PaySuite (ULID)
    @Column(name = "paysuite_id", length = 60)
    private String paysuiteId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Column(length = 20)
    private String metodo; // mpesa, emola, credit_card

    // PENDING, PAID, FAILED, CANCELLED
    @Column(nullable = false, length = 20)
    private String estado = "PENDING";

    // O que está a ser pago: VENDA (loja) ou PLANO (mensalidade)
    @Column(nullable = false, length = 20)
    private String contexto;

    @Column(name = "contexto_id")
    private UUID contextoId;

    @Column(name = "cliente_id")
    private UUID clienteId;

    @Column(length = 150)
    private String descricao;

    @Column(name = "checkout_url", columnDefinition = "TEXT")
    private String checkoutUrl;

    @Column(name = "transaction_id", length = 80)
    private String transactionId;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(columnDefinition = "TEXT")
    private String erro;

    // Idempotência do webhook (request_id do PaySuite já processado)
    @Column(name = "webhook_request_id", length = 80)
    private String webhookRequestId;

    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }
    public String getPaysuiteId() { return paysuiteId; }
    public void setPaysuiteId(String paysuiteId) { this.paysuiteId = paysuiteId; }
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    public String getMetodo() { return metodo; }
    public void setMetodo(String metodo) { this.metodo = metodo; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getContexto() { return contexto; }
    public void setContexto(String contexto) { this.contexto = contexto; }
    public UUID getContextoId() { return contextoId; }
    public void setContextoId(UUID contextoId) { this.contextoId = contextoId; }
    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getCheckoutUrl() { return checkoutUrl; }
    public void setCheckoutUrl(String checkoutUrl) { this.checkoutUrl = checkoutUrl; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public String getErro() { return erro; }
    public void setErro(String erro) { this.erro = erro; }
    public String getWebhookRequestId() { return webhookRequestId; }
    public void setWebhookRequestId(String webhookRequestId) { this.webhookRequestId = webhookRequestId; }
}
