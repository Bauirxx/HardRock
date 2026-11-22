package com.gym.member.model;

import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "sessoes")
public class SessaoEntity extends BaseEntity {

    @Column(name = "cliente_id")
    private UUID clienteId;

    @Column(name = "trainer_id")
    private UUID trainerId;

    @Column
    private LocalDate data;

    @Column(name = "hora_inicio", length = 10)
    private String horaInicio;

    @Column(name = "hora_fim", length = 10)
    private String horaFim;

    @Column(nullable = false, length = 20)
    private String status = "scheduled";

    @Column(columnDefinition = "TEXT")
    private String notas;

    @Column(length = 120)
    private String local;

    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }
    public UUID getTrainerId() { return trainerId; }
    public void setTrainerId(UUID trainerId) { this.trainerId = trainerId; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public String getHoraInicio() { return horaInicio; }
    public void setHoraInicio(String horaInicio) { this.horaInicio = horaInicio; }
    public String getHoraFim() { return horaFim; }
    public void setHoraFim(String horaFim) { this.horaFim = horaFim; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public String getLocal() { return local; }
    public void setLocal(String local) { this.local = local; }
}
