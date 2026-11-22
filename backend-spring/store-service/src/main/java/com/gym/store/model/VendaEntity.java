package com.gym.store.model;

import com.gym.common.enums.EstadoVenda;
import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "vendas")
public class VendaEntity extends BaseEntity {

    @Column(name = "cliente_id", nullable = false)
    private UUID clienteId;

    @Column(name = "valor_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private EstadoVenda estado = EstadoVenda.PENDENTE;

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemVendaEntity> items = new ArrayList<>();

    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }
    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
    public EstadoVenda getEstado() { return estado; }
    public void setEstado(EstadoVenda estado) { this.estado = estado; }
    public List<ItemVendaEntity> getItems() { return items; }
    public void setItems(List<ItemVendaEntity> items) { this.items = items; }
}
