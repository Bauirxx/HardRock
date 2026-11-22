package com.gym.store.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;

public record CreateVendaDTO(
    // Opcional — permite compra por cliente logado ou convidado (guest checkout)
    UUID clienteId,
    @NotEmpty List<ItemVendaDTO> items
) {
    public record ItemVendaDTO(
        // Aceita produto_id (snake) e product_id (frontend da loja)
        @JsonAlias({"product_id"})
        @NotNull UUID produtoId,
        @Min(1) int quantidade
    ) {}
}
