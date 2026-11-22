package com.gym.store.service;

import com.gym.common.enums.EstadoVenda;
import com.gym.common.exception.BusinessException;
import com.gym.common.exception.ResourceNotFoundException;
import com.gym.store.dto.*;
import com.gym.store.model.*;
import com.gym.store.repository.ProdutoRepository;
import com.gym.store.repository.VendaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class VendaService {

    private static final Logger log = LoggerFactory.getLogger(VendaService.class);
    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;
    private final RabbitTemplate rabbitTemplate;

    public VendaService(VendaRepository vendaRepository, ProdutoRepository produtoRepository,
                        RabbitTemplate rabbitTemplate) {
        this.vendaRepository = vendaRepository;
        this.produtoRepository = produtoRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    public Page<VendaDTO> listarTodas(Pageable pageable) {
        return vendaRepository.findByActivoTrue(pageable).map(VendaDTO::from);
    }

    public VendaDTO buscarPorId(UUID id) {
        return VendaDTO.from(vendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda", id)));
    }

    @Transactional
    public VendaDTO criar(CreateVendaDTO dto) {
        VendaEntity venda = new VendaEntity();
        venda.setClienteId(dto.clienteId());
        venda.setEstado(EstadoVenda.PENDENTE);

        BigDecimal total = BigDecimal.ZERO;

        for (CreateVendaDTO.ItemVendaDTO itemDto : dto.items()) {
            ProdutoEntity produto = produtoRepository.findById(itemDto.produtoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto", itemDto.produtoId()));

            if (produto.getStock() < itemDto.quantidade()) {
                throw new BusinessException("Stock insuficiente para " + produto.getNome(), HttpStatus.CONFLICT);
            }

            ItemVendaEntity item = new ItemVendaEntity();
            item.setVenda(venda);
            item.setProdutoId(produto.getId());
            item.setQuantidade(itemDto.quantidade());
            item.setPrecoUnitario(produto.getPreco());
            venda.getItems().add(item);

            total = total.add(produto.getPreco().multiply(BigDecimal.valueOf(itemDto.quantidade())));
        }

        venda.setValorTotal(total);
        venda = vendaRepository.save(venda);
        return VendaDTO.from(venda);
    }

    @Transactional
    public VendaDTO concluir(UUID id) {
        VendaEntity venda = vendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda", id));

        if (venda.getEstado() != EstadoVenda.PENDENTE) {
            throw new BusinessException("Venda não está pendente");
        }

        for (ItemVendaEntity item : venda.getItems()) {
            ProdutoEntity produto = produtoRepository.findById(item.getProdutoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto", item.getProdutoId()));
            if (produto.getStock() < item.getQuantidade()) {
                throw new BusinessException("Stock insuficiente para " + produto.getNome(), HttpStatus.CONFLICT);
            }
            produto.setStock(produto.getStock() - item.getQuantidade());
            produtoRepository.save(produto);
        }

        venda.setEstado(EstadoVenda.CONCLUIDA);
        venda = vendaRepository.save(venda);

        publicarEvento("VENDA_CONCLUIDA", venda);
        return VendaDTO.from(venda);
    }

    @Transactional
    public VendaDTO cancelar(UUID id) {
        VendaEntity venda = vendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda", id));

        if (venda.getEstado() == EstadoVenda.CONCLUIDA) {
            for (ItemVendaEntity item : venda.getItems()) {
                ProdutoEntity produto = produtoRepository.findById(item.getProdutoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Produto", item.getProdutoId()));
                produto.setStock(produto.getStock() + item.getQuantidade());
                produtoRepository.save(produto);
            }
        }

        venda.setEstado(EstadoVenda.CANCELADA);
        venda = vendaRepository.save(venda);

        publicarEvento("VENDA_CANCELADA", venda);
        return VendaDTO.from(venda);
    }

    private void publicarEvento(String eventType, VendaEntity venda) {
        try {
            rabbitTemplate.convertAndSend("venda.exchange", "venda." + eventType.toLowerCase(),
                    Map.of("eventType", eventType, "vendaId", venda.getId().toString(),
                            "clienteId", venda.getClienteId().toString(),
                            "valorTotal", venda.getValorTotal().toString(),
                            "timestamp", LocalDateTime.now().toString()));
        } catch (Exception e) {
            log.warn("[EVENTO] Falha ao publicar {}: {}", eventType, e.getMessage());
        }
    }
}
