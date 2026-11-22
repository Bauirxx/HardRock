package com.gym.gym.model;

import com.gym.common.enums.EstadoPlano;
import com.gym.common.enums.TipoPlano;
import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "planos")
public class PlanoEntity extends BaseEntity {

    @Column(name = "cliente_id", nullable = false)
    private UUID clienteId;

    @Column(name = "servico_id", nullable = false)
    private UUID servicoId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_plano", nullable = false, length = 15)
    private TipoPlano tipoPlano;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;

    @Column(name = "preco_pago", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoPago;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private EstadoPlano estado = EstadoPlano.ACTIVO;

    @Column(name = "personal_trainer_id")
    private UUID personalTrainerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servico_id", insertable = false, updatable = false)
    private ServicoEntity servico;

    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }
    public UUID getServicoId() { return servicoId; }
    public void setServicoId(UUID servicoId) { this.servicoId = servicoId; }
    public TipoPlano getTipoPlano() { return tipoPlano; }
    public void setTipoPlano(TipoPlano tipoPlano) { this.tipoPlano = tipoPlano; }
    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }
    public BigDecimal getPrecoPago() { return precoPago; }
    public void setPrecoPago(BigDecimal precoPago) { this.precoPago = precoPago; }
    public EstadoPlano getEstado() { return estado; }
    public void setEstado(EstadoPlano estado) { this.estado = estado; }
    public UUID getPersonalTrainerId() { return personalTrainerId; }
    public void setPersonalTrainerId(UUID personalTrainerId) { this.personalTrainerId = personalTrainerId; }
    public ServicoEntity getServico() { return servico; }
}
