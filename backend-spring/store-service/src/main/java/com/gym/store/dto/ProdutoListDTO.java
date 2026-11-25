package com.gym.store.dto;

import com.gym.common.enums.CategoriaProduto;
import com.gym.store.model.ProdutoEntity;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * Versão leve do produto para LISTAS (catálogo/admin). Não inclui o array
 * completo de imagens base64 — só a imagem principal — para a resposta não
 * exceder os limites de buffer quando há muitos produtos.
 */
public record ProdutoListDTO(
    UUID id, String nome, String descricao, CategoriaProduto categoria, String tipo,
    BigDecimal preco, BigDecimal precoPromocional, int stock, int stockQuantidade,
    String sku, boolean isMachine, boolean sobConsulta, boolean destaque,
    String imagemUrl, String youtubeUrl, boolean activo
) {
    public static ProdutoListDTO from(ProdutoEntity p) {
        return new ProdutoListDTO(
            p.getId(), p.getNome(), p.getDescricao(), p.getCategoria(), p.getTipo(),
            p.getPreco(), p.getPrecoPromocional(), p.getStock(), p.getStock(),
            p.getSku(), p.isMachine(), p.isSobConsulta(), p.isDestaque(),
            p.getImagemUrl(), p.getYoutubeUrl(), p.isActivo()
        );
    }
}
