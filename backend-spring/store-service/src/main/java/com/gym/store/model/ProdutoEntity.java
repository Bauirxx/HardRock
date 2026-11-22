package com.gym.store.model;

import com.gym.common.enums.CategoriaProduto;
import com.gym.common.model.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produtos")
public class ProdutoEntity extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CategoriaProduto categoria;

    @Column(length = 30)
    private String tipo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(name = "preco_promocional", precision = 10, scale = 2)
    private BigDecimal precoPromocional;

    @Column(nullable = false)
    private int stock = 0;

    @Column(length = 60)
    private String sku;

    @Column(name = "is_machine", nullable = false)
    private boolean isMachine = false;

    @Column(name = "sob_consulta", nullable = false)
    private boolean sobConsulta = false;

    @Column(nullable = false)
    private boolean destaque = false;

    @Column(name = "imagem_url", columnDefinition = "TEXT")
    private String imagemUrl;

    @Column(name = "youtube_url", length = 300)
    private String youtubeUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "produto_imagens", joinColumns = @JoinColumn(name = "produto_id"))
    @Column(name = "imagem", columnDefinition = "TEXT")
    private List<String> imagens = new ArrayList<>();

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public CategoriaProduto getCategoria() { return categoria; }
    public void setCategoria(CategoriaProduto categoria) { this.categoria = categoria; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
    public BigDecimal getPrecoPromocional() { return precoPromocional; }
    public void setPrecoPromocional(BigDecimal precoPromocional) { this.precoPromocional = precoPromocional; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public boolean isMachine() { return isMachine; }
    public void setMachine(boolean machine) { isMachine = machine; }
    public boolean isSobConsulta() { return sobConsulta; }
    public void setSobConsulta(boolean sobConsulta) { this.sobConsulta = sobConsulta; }
    public boolean isDestaque() { return destaque; }
    public void setDestaque(boolean destaque) { this.destaque = destaque; }
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
    public String getYoutubeUrl() { return youtubeUrl; }
    public void setYoutubeUrl(String youtubeUrl) { this.youtubeUrl = youtubeUrl; }
    public List<String> getImagens() { return imagens; }
    public void setImagens(List<String> imagens) { this.imagens = imagens != null ? imagens : new ArrayList<>(); }
}
