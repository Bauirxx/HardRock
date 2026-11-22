package com.gym.store.dto;

import com.gym.common.enums.EstadoVenda;
import com.gym.store.model.ItemVendaEntity;
import com.gym.store.model.VendaEntity;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record VendaDTO(UUID id, UUID clienteId, BigDecimal valorTotal, EstadoVenda estado,
                       List<ItemDTO> items, LocalDateTime dataCriacao) {

    public record ItemDTO(UUID produtoId, int quantidade, BigDecimal precoUnitario) {
        public static ItemDTO from(ItemVendaEntity i) {
            return new ItemDTO(i.getProdutoId(), i.getQuantidade(), i.getPrecoUnitario());
        }
    }

    public static VendaDTO from(VendaEntity v) {
        List<ItemDTO> its = v.getItems().stream().map(ItemDTO::from).toList();
        return new VendaDTO(v.getId(), v.getClienteId(), v.getValorTotal(),
                v.getEstado(), its, v.getDataCriacao());
    }
}
