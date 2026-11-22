package com.gym.store.dto;

import com.gym.common.enums.CategoriaProduto;
import com.gym.store.model.ProdutoEntity;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProdutoDTO(
    UUID id, String nome, String descricao, CategoriaProduto categoria, String tipo,
    BigDecimal preco, BigDecimal precoPromocional, int stock, int stockQuantidade,
    String sku, boolean isMachine, boolean sobConsulta, boolean destaque,
    String imagemUrl, String youtubeUrl, List<String> imagens, boolean activo
) {
    public static ProdutoDTO from(ProdutoEntity p) {
        return new ProdutoDTO(
            p.getId(), p.getNome(), p.getDescricao(), p.getCategoria(), p.getTipo(),
            p.getPreco(), p.getPrecoPromocional(), p.getStock(), p.getStock(),
            p.getSku(), p.isMachine(), p.isSobConsulta(), p.isDestaque(),
            p.getImagemUrl(), p.getYoutubeUrl(), p.getImagens(), p.isActivo()
        );
    }
}
