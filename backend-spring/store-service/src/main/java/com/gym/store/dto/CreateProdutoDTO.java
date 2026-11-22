package com.gym.store.dto;

import com.gym.common.enums.CategoriaProduto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record CreateProdutoDTO(
    @NotBlank String nome,
    @NotBlank String descricao,
    CategoriaProduto categoria,
    String tipo,
    @NotNull @DecimalMin("0.0") BigDecimal preco,
    BigDecimal precoPromocional,
    Integer stock,
    Integer stockQuantidade,
    String sku,
    Boolean isMachine,
    Boolean sobConsulta,
    Boolean destaque,
    String imagemUrl,
    String youtubeUrl,
    List<String> imagens
) {}
